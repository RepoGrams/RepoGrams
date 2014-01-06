<?php
	require_once("convert.php");
	require_once("action.php");
	class algorithm {

	public function render($commitObjectArray, $modus_length = 0, $modus_color = 0, $width, $height){
		$commitArray = $this->preprocess($commitObjectArray);
		$count = count($commitArray);

		callback('Start rendering...');

		################################################## 
		################### Create SVG ###################
		$datei = fopen("visualization-".session_id().".svg",  "w+");
$s = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?> \n
<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\"  \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"> \n
<svg \n
	width=\"".$width."px\" height=\"".$height."px\" version=\"1.1\" id=\"test\" \n
	xmlns:dc=\"http://purl.org/dc/elements/1.1/\"
   xmlns:cc=\"http://creativecommons.org/ns#\"
   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"
   xmlns:svg=\"http://www.w3.org/2000/svg\"
   xmlns=\"http://www.w3.org/2000/svg\"> \n
<defs id=\"defs4\" /> \n
<g id=\"layer1\"> \n
<g \n
	transform=\"translate(0,0)\" \n
	id=\"g24941\"> \n";
		fwrite($datei, utf8_encode($s));
		################################################## 

		callback('Initialize image...');

		$returnArray = array();


		###################################################

		$all_diff = 0;
		for ($j = 0; $j < $count; $j++){
			$all_diff += $commitArray[$j][1]; 
		}

		$add_diff = 0;
		for ($j = 0; $j < $count; $j++){
			$add_diff += $commitArray[$j][2]; 
		}

		$del_diff = 0;
		for ($j = 0; $j < $count; $j++){
			$del_diff += $commitArray[$j][3]; 
		}

		$pixel = $width * $height;

		###################################################

		$x = 0; 	#links oben -> links
		$y = 0; 	#links oben -> oben
		$hohe = 16;
		while($width%$hohe != 0)
		$hohe--; 	#rechts unten -> links BREITE

		$z = $hohe;	#rechts unten -> oben HÖHE

		for ($i = 0; $i < $count; $i++){
			if ($modus_length == 1){
				if ($commitArray[$i][2] <= 0) {
					break;
				}
			}
			if ($modus_length == 2){
				if ($commitArray[$i][3] <= 0) {
					break;
				}
			}
			$block = this->commitToBlock($commitArray[$i], $modus_length, $modus_color, $hohe, $all_diff, $add_diff, $del_diff, $pixel, $hohe); //length, heigth, color
			$length = $block[0];
			$color = $block[2];
			$w = $x + $length;
			if ($w > $width){
	 			$this->writeBlock($datei, $color, $x, $y, ($width-$x), $hohe, $id);
	 			$returnArray[] = array(($width-$x), $hohe, $color);
	 			$id++;
	 			$length = $length-$width;
	 			$x = 0;
				$y += $hohe;
				$z += $hohe;
				while($length > $width){
					$this->writeBlock($datei, $color, $x, $y, $width, $hohe, $id);
	 				$returnArray[] = array($width, $hohe, $color);
					$id++;
					$x = 0;
					$y += $hohe;
					$z += $hohe;
					$length = $length-$width;
				}
				$this->writeBlock($datei, $color, $x, $y, $length, $hohe, $id);
	 			$returnArray[] = array($length, $hohe, $color);
				$id++;
				$x += $length;
			}
			else{
				$this->writeBlock($datei, $color, $x, $y, $length, $hohe, $id);
				$returnArray[] = $block[i];
				$id++;
				$x += $length;
			}
		}

		callback('Initialize image...');
		fwrite($datei, utf8_encode("</g> </g></svg> \n"));
		fclose($datei);
		return $returnArray;

	}

	private function commitToBlock($commitArray, $modus_length, $modus_color, $all_diff, $add_diff, $del_diff, $pixel, $hohe){

		$color = $this->commitToColor($modus_color, $commitArray[i])

		switch ($modus_length) {
			case 0:			#all
				$factor = ($pixel/$hohe) / $all_diff;
				$diff = $commitArray[1];
				$length = ($factor * $diff);
				break;
			
			case 1:			#add
				$factor = ($pixel/$hohe) / $add_diff;
				$diff = $commitArray[2];
				$length = ($factor * $diff);
				break;

			case 2:			#del
				$factor = ($pixel/$hohe) / $del_diff;
				$diff = $commitArray[3];
				$length = ($factor * $diff);
				break;

			default:
				echo "Hier läuft was schief.";
				break;
		}

		return array($length, $hohe, $color);
	}

	private function commitToColor($modus, $commitArray){
		$conv = new convert();
	
		switch ($modus) {

			###################################################
			## Commit Message encoded in first three letters ##
			###################################################

			case 0:
				$msg = $commitArray[0];
				if ($msg == null)
					return array(211,211,211);
				$msg = preg_replace("/[^a-zA-Z0-9]/" , "" , $msg);
	   			$msg = strtolower($msg);
	    		if (strlen($msg) == 0)	
	    			return array(211,211,211);
		   		$first = substr($msg, 0, 1);
				$h = $this->letterValue($first, 0);
		   		if (strlen($msg) > 1){
		   			$second = substr($msg, 1, 1);
		   			$s = 0.3 + 0.6 * $this->letterValue ($second, 1);
		   			if (strlen($msg) > 2) {
		   				$third = substr($msg, 2, 1);
		   				$l = 0.4 + 0.5 * $this->letterValue ($third, 2);
		   			}
		   			else {
		   				$l = 0.6;
		   			}
		   		}
	    		else{
	    			$s = 0.5;
	    			$l = 0.6;
	    		}
	    		$convArray = $conv->ColorHSLToRGB($h,$s,$l);
	    		$r = $convArray['r'];
		   		$g = $convArray['g'];
		   		$b = $convArray['b'];
		   		$color = array($r,$g,$b);
		    	$color = ImageColorAllocate($img, $r, $g, $b);
		    	return $color;

		    ###################################################
			#### Commit Message encoded in logical content ####
			###################################################

			case 1:
				$msg = $commitArray[0];
				if ($msg == null)
					return array(211,211,211);
				$msg = preg_replace("/[^a-zA-Z0-9 ]/" , "" , $msg);
			    $msg = strtolower($msg);
			    if (strlen($msg) == 0)	
			    	return array(211,211,211);
				$keys1 = array("add", "new", "create");
				$section1 = array_fill_keys($keys1, "section1");
					
				$keys2 = array("delete", "remove");
				$section2 = array_fill_keys($keys2, "section2");
					
				$keys3 = array("fix", "bug");
				$section3 = array_fill_keys($keys3, "section3");

				$keyword_Array = array_merge($section1, $section2, $section3);
					
				$stringRep = explode(" ", $msg);
										
				$sec1 = 0;
				$sec2 = 0;
				$sec3 = 0;					
					
				$anzahl = count($stringRep);
					
				foreach($stringRep as $string){ 
					foreach($keys1 as $key){
						if(!((strripos($string, $key)) === false)){
							$sec1++;
						}
					}
					foreach($keys2 as $key){
						if(!((strripos($string, $key)) === false)){
							$sec2++;
						}
					}
					foreach($keys3 as $key){
						if(!((strripos($string, $key)) === false)){
							$sec3++;
						}
					}
					
				}

				$max = $sec1 + $sec2 + $sec3;
				$p = 0;
				if($max != 0)
					$p = (255 / $max);
					
				$sec1 = $p * $sec1;
				$sec2 = $p * $sec2;
				$sec3 = $p * $sec3;
					
				$color = $sec1.",".$sec2.",".$sec3;
		   		return $color;
				break;

		    ###################################################
			#### Authorname encoded in first three letters ####
			###################################################

			case 2: 
				$name = $commitArray[4];
				$name = preg_replace("/[^a-zA-Z0-9]/" , "" , $name);
	   			$name = strtolower($name);
		   		$first = substr($name, 0, 1);
				$h = $this->letterValue($first, 0);
		   		if (strlen($name) > 1){
		   			$second = substr($name, 1, 1);
		   			$s = 0.3 + 0.6 * $this->letterValue ($second, 1);
		   			if (strlen($msg) > 2) {
		   				$third = substr($name, 2, 1);
		   				$l = 0.4 + 0.5 * $this->letterValue ($third, 2);
		   			}
		   			else {
		   				$l = 0.6;
		   			}
		   		}
	    		else{
	    			$s = 0.5;
	    			$l = 0.6;
	    		}
	    		$convArray = $conv->ColorHSLToRGB($h,$s,$l);
	    		$r = $convArray['r'];
		   		$g = $convArray['g'];
		   		$b = $convArray['b'];
		   		$color = array($r,$g,$b);
		    	$color = ImageColorAllocate($img, $r, $g, $b);
		    	return $color;
				break;

			###################################################
			############## Time of day of commit ##############
			###################################################

			case 3:
				$time = $commitArray[5]; #TODO wie bekomme ich die genaue Zeit?
				$hour = date('G', $time);
				$minute = date('i', $time);

				if ($hour < 12){
					$l = 0.35;
				}
				else{
					$l = 0.65;
					$hour = $hour/2;
				}

				$h = $hour * 0.08;
				$s = 0.39 + 0.01 * $minute;

				$convArray = $conv->ColorHSLToRGB($h,$s,$l);
	    		$r = $convArray['r'];
		   		$g = $convArray['g'];
		   		$b = $convArray['b'];
		   		$color = array($r,$g,$b);
		    	$color = ImageColorAllocate($img, $r, $g, $b);
		    	return $color;
				break;

			###################################################
			################# Date of commit ##################
			###################################################

			case 4:
				$time = $commitArray[5]; #TODO wie bekomme ich die genaue Zeit?
				$day  = date('j', $time);
				$month = date('n', $time);
				$year = date('Y', $time);

				$h = $day * 0.03;
				$s = 0.49 + $month * 0.04;
				$l = ($year - 1990) * 0.04;
				break;

			default:
				echo "Hier läuft was schief.";
				break;
		}
	}

		private function preprocess($obj){
			require_once(__DIR__."/../lib/vcs/Commit.interface.php");
			for ($i = 0; $i < count($obj); $i++){
				$array[$i] = array($obj[$i]->CommitMessage(), $obj[$i]->NumChangedLines(), $obj[$i]->NumAddedLines(), $obj[$i]->NumRemovedLines(), $obj[$i]->CommitAuthor(), $obj[$i]->CommitTime()) ;
			}
			return $array;
		}


		private function letterValue($letter) {

			$letterArray = array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z");

			$numberArray = array("y", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9");


			if (is_numeric($letter)){
		    	$value = array_search($letter, $numberArray);
		    	$value = ($value * (26/10))-1;
			}
			else{
		    	$value = array_search($letter, $letterArray);
		    }
		    return $value /26;
		}

		private function writeBlock($datei, $color, $x, $y, $w, $h){
			if ($w <= 0){
				$w = 0.1;
			}
			$hexcolor = $conv->RGBtoHex($color[0],$color[1],$color[2]);
			$s = " <rect x = \"".$x."\" y =\"".$y."\" width =\"".$w."\" height=\"".$h."\" rx=\"0\" ry=\"0\" id =\"rect".$id."\" style=\"fill:".$hexcolor.";stroke:none\" /> \n";
			fwrite($datei, utf8_encode($s));
		}
	}
?>


