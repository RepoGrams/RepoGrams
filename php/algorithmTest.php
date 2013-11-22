<?php
	include("convert.php");
	class algorithm {

	
		public function render($commitObjectArray, $modus = 0){ //array looks like this [[$msg, $diff],[$msg, $diff],[$msg, $diff]]
			$commitArray = $commitObjectArray; //$commitArray = $this->preprocess($commitObjectArray);
			$count = count($commitArray);

			$all_diff = 0;

			for ($j = 0; $j < $count; $j++){

				$all_diff += $commitArray[$j][1]; 

				################################
				### negativen diff behandeln ###
				################################

			}

			################################################## 
			$width = 300; # Später die Breite des Rechtecks 
			$height = 300; # Später die Höhe des Rechtecks 
			$img = ImageCreate($width, $height); # Hier wird das Bild einer Variable zu gewiesen 
			################################################## 
			
			$x = 0; 	#links oben -> links
			$y = 0; 	#links oben -> oben
			$hohe = 15; 	#rechts unten -> links BREITE
			$z = $hohe;	#rechts unten -> oben HÖHE

			$pixel = $width * $height; #all pixels on picture
			$factor = ($pixel/$hohe) / $all_diff;

			for ($i = 0; $i < $count; $i++){
				$diff = $commitArray[$i][1];
				$str = $commitArray[$i][0];
				$color = $this->commitToColor($modus, $str, $img);
 		 		#$color = ImageColorAllocate($img, 100, 100, 100);
 		 		$w = ($x+($diff*$factor));
				ImageFilledRectangle($img, $x, $y, $w, $z, $color); 
				if ($w > $width)
				while ($w > $width){
					$overlap = $w-$width;
					$x = 0;
					$y += $hohe;
					$w = $overlap;
					$z += $hohe;
					ImageFilledRectangle($img, $x, $y, $w, $z, $color); 
					$x += $w;
				}
				else{
					$x += $diff*$factor;
				}
			}

			imagepng($img, "visualization.png");
			return $img;
		}

		public function commitToColor($modus, $msg, $img){
			$conv = new convert();
			if ($msg == null or strlen($msg) == 0)
		      			return ImageColorAllocate($img, 211, 211, 211);
		    $msg = preg_replace("/[^a-zA-Z0-9 ]/" , "" , $msg);
		    $msg = strtolower($msg);
		    switch ($modus) {
				case 0:
					$msg = preg_replace("/[^a-zA-Z0-9]/" , "" , $msg);
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
		    			$l = 0.6;
		    			$s = 0.5;
		    		}
		    		$convArray = $conv->ColorHSLToRGB($h,$s,$l);
		    		$r = $convArray['r'];
		    		$g = $convArray['g'];
		    		$b = $convArray['b'];
		    		$color = ImageColorAllocate($img, $r, $g, $b);
		    		return $color;
				case 1:
					$keys1 = array("add", "new", "create");
					$section1 = array_fill_keys($keys1, "section1");
					
					$keys2 = array("delete", "remove");
					$section2 = array_fill_keys($keys2, "section2");
					
					$keys3 = array("fix", "bug");
					$section3 = array_fill_keys($keys3, "section3");

					$keyword_Array = array_merge($section1, $section2, $section3);
					
					/* hier muss der String noch zerteilt werden */
					$stringRep = explode(" ", $msg);
										
					$sec1 = 0;
					$sec2 = 0;
					$sec3 = 0;					
					
					$anzahl = count($stringRep);
					
					foreach($stringRep as $string){ 
						foreach($keys1 as $key){
							if(!((strripos($string, $key)) === false))
							{
								$sec1++;
							}
						}
						foreach($keys2 as $key){
							if(!((strripos($string, $key)) === false))
							{
								$sec2++;
							}
						}
						foreach($keys3 as $key){
							if(!((strripos($string, $key)) === false))
							{
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
					
					$color = ImageColorAllocate($img, $sec1, $sec2, $sec3);
		    		return $color;
					break;
				default:
					echo "Hier läuft was schief.";
					break;
			}
		}


		private function preprocess($obj){
			include("../lib/vs/Commit.interface.php");
			for ($i = 0; $i < count($obj); $i++){
				$array[$i] = array($obj[$i]->CommitMessage(), $obj[$i]->DiffToParent()) ;
			}
			return $array;
		}


		private function letterValue($letter) {

			$letterArray = array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z");

			$numberArray = array("y", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9");


			if (is_numeric($letter)){
		    	$value = array_search($letter, $numberArray);
		    	$value = $value * (10/26);
			}
			else{
		    	$value = array_search($letter, $letterArray);
		    }
		    return $value /26;
		}

	}


?>