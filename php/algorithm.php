<?php
error_reporting(-1);
require_once("convert.php");
require_once(__DIR__."/../lib/vcs/git/GitChanges.class.php");
require_once(__DIR__."/../lib/vcs/git/GitCommit.class.php");
require_once(__DIR__."/../config.inc.php");
class algorithm {

	############# Render Fuction ############
	##### Called to render a repository #####
	#########################################

	public function render($commitObjectArray, $modus_color = 0, $width, $height){
		$commitA = $this->preprocess($commitObjectArray); 
		########################################### Format ############################################
		##### array with commit message, number of changed lines, author and time for all commits #####
		###############################################################################################

		$commitArray = array_reverse($commitA); #input is sorted by desc
		$count = count($commitArray);

		#######################
		###### Create SVG #####
		#######################

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

		$returnArray = array(); #contains the data for rendering the image, format: array(Legende), array(line 1), ....,  array(line n)
		$currentArray = array(); #temporary storage for the current line of blocks, format: width, height, color, commit message, time, author

		###################################################

		$all_diff = 0;
		for ($j = 0; $j < $count; $j++){
			$all_diff += $commitArray[$j][1]; 
		}

		$pixel = $width * $height;

		###################################################

		$x = 0; 	# beginning
		$y = 0; 	
		$hohe = 16;

		$returnArray[] = array(); # reserve first element for legend
		$legende = array(); # initialize legend
		$ranking = array(); # help array for colleceting ranking informations  

		while($width%$hohe != 0){	#adapt height of the blocks to the height of the hole picture
			$hohe--; 
		}

		$id = 0;	# id for the rectangles of the svg

		##############################################
		########### Start Render Algorithm ###########
		##############################################

		for ($i = 0; $i < $count; $i++){

			##### cut the commit message #####
			$str = $commitArray[$i][0];
			$str = preg_replace("/\"/" , "&quot;" , $str);
			$str = preg_replace("/</", "&lt;", $str);
			$str = preg_replace("/>/", "&gt;", $str);
			##################################

			$time = $commitArray[$i][3];
			$author = $commitArray[$i][2];
			$author = preg_replace("/\"/" , "&quot;" , $author);
			$author = preg_replace("/</", "&lt;", $author);
			$author = preg_replace("/>/", "&gt;", $author);


			$block = $this->commitToBlock($commitArray[$i], $modus_color, $all_diff, $pixel, $hohe); 
			
			##################### format of block #####################
			##### width, color, cutted commit message for legend ######
			###########################################################
			
			$length = $block[0];
			$color = $block[1];
			$txt = $block[2];

			$w = $x + $length; # position at the end of the block

			if ($length == 0){ # nothing to do here
				continue;
			}

			switch($modus_color){ # modus for legend 
				case 2:
				case 3:
					break; # constant legend
				case 0:
				case 1:
					$ranking[] = array($txt, $color); # adding key and color 
					break;
				default:
					error_log("Wrong modus for color"); # should not appear!
					break;
			}


			##### checking if the endposition of the block is out of the picture #####
			if ($w > $width){ 
				##### color the block till the end of the line #####  
				$this->writeBlock($datei, $color, $x, $y, ($width-$x), $hohe, $id);			# write SVG
	 			$currentArray[] = array(($width-$x), $hohe, $color, $str, $time, $author); 	# adding block to current line
	 			$returnArray[] = $currentArray; 		# end of currend line, adding to return array
	 			$currentArray = array(); 				# clear current array
	 			$id++; 
	 			$length = $length-($width-$x); 			# carryover from the block
	 			$x = 0;									# set x the the beginning of the line
				$y += $hohe;							# set y to the next row

				##### check if the carryover is still larger then the picture #####
				while($length > $width){
					$this->writeBlock($datei, $color, $x, $y, $width, $hohe, $id);  		# write hole line to svg
	 				$currentArray[] = array($width, $hohe, $color, $str, $time, $author);	# color hole line  
	 				$returnArray[] = $currentArray;		# end of current line, adding to return array
	 				$currentArray = array(); 			# clear current array
					$id++;
					$x = 0;								# set x the the beginning of the line
					$y += $hohe;						# set y to the next row
					$length = $length-$width;			# carryover from the block
				}
				$this->writeBlock($datei, $color, $x, $y, $length, $hohe, $id);				# write carryover to svg
	 			if($length > 0.01){
	 				$currentArray[] = array($length, $hohe, $color, $str, $time, $author); 	# wrinte carryover to current line
					$id++;
					$x += $length; 						# set current position
	 			}
			}
			else{
				$currentArray[] = array($length, $hohe, $color, $str, $time, $author); 		# write block to current line
				if ($i == $count-1){					# check if it is the last commit
					$returnArray[] = $currentArray; 	# end of current line
					$this->writeBlock($datei, $color, $x, $y, ($width-$x), $hohe, $id); 	# write block to svg til the end of the line (decimal point adjustment)
				}
				else{
					$this->writeBlock($datei, $color, $x, $y, $length, $hohe, $id); 		# write block to svg
				}
				$id++;
				$x += $length;							#set current position
			}
		}

		$conv = new convert();

		###########################
		###### Create Legend ######
		###########################

		switch($modus_color){
			#################################################
			##### Cases: first three letters or author ######
			#################################################
			case 0:
			case 1:
				$rankedLegend = array();   # helper array, carries key + color + quantity

				##### Count appearance #####
				for ($c = 0; $c < count($ranking); $c++){
					$found = false;
					for ($d = 0; $d < count($rankedLegend); $d++){
						if ($ranking[$c][0] == $rankedLegend[$d][0]){
							$rankedLegend[$d][2] = $rankedLegend[$d][2] + 1;
							$found = true;
							break;
						}
					}
					if (!$found){
						$rankedLegend[] = array($ranking[$c][0],$ranking[$c][1], 1);
					}
				}

				##### sort the array #####
				$rankedLegend = $this->myArraySort($rankedLegend);
				############ format #############
				##### key, color, quantitiy #####
				#################################

				##### legend should countain at most 30 entries #####
				$legende = array();		# legend should be realy empty :)
				if (count($rankedLegend) > 30){
					for ($c = 0; $c < 30; $c++){
						$legende[] = array($rankedLegend[$c][0],$rankedLegend[$c][1]);
					}
				}
				 else{
				 	for ($c = 0; $c < count($rankedLegend); $c++){
						$legende[] = array($rankedLegend[$c][0],$rankedLegend[$c][1]);
					}
				 }
				break;

			######################
			##### Case: Time #####
			######################
			case 2:
				$hour = 0;
				$go = 0;
				$minute = 0;
				$legende = array();
				##### prining every hour #####
				while($go < 24){
					$hour = $go;
					if ($hour < 12){
						$l = 0.35;
					}
					else{
						$l = 0.65;
						$hour = $hour-12;
					}

					$h = $hour * 0.08;
					$s = 0.39 + 0.01 * $minute;

					$convArray = $conv->ColorHSLToRGB($h,$s,$l);
	    			$r = $convArray['r'];
		   			$g = $convArray['g'];
		   			$b = $convArray['b'];
		   			$color = array($r,$g,$b);
		    		$legende[]=array("Hour: ".$go, $color);
		    		$go++;
				}
 				break;

 			######################
 			##### Case: Date #####
 			######################
			case 3:
				$day  = 15;
				$month = 1;
				$year = 2004;

				$l = 0.1 + $day * 0.01;

				$legende = array();
				##### printing first and sixth month of every year from 2004 to 2015 ##### 
				while($year < 2015){
					$s = 0.49 + $month * 0.04;
					$h = ($year - 2004) * 0.04;
					$convArray = $conv->ColorHSLToRGB($h,$s,$l);
		    		$r = $convArray['r'];
			   		$g = $convArray['g'];
			   		$b = $convArray['b'];
			   		$color = array($r,$g,$b);
			    	if ($month == 1){
			    		$legende[] = array("January of ".$year, $color);
			    		$month = 6;
			    	}
			    	else{
			    		$legende[] = array("June of  ".$year, $color);
			    		$year++;
			    		$month = 1;
			    	}
				}
				break;
			default:
				error_log("Wrong modus for color"); # should not appear!
				break;
		}
		$returnArray[0] = $legende; # set legend to first part of the array
		fwrite($datei, utf8_encode("</g> </g></svg> \n"));
		fclose($datei);
		return $returnArray;
	}

	######################################## commitToBlock Function ########################################
	##### Computate the length and color of the blocks                                                 #####
	##### Input: commitArray(ommit message, number of changed lines, author and time for all commits), #####
	#####                     modus of the color, diff, amount of pixel and height of the hole picture #####
	##### Output: length of the block, color of the block and key for the legend                       #####
	########################################################################################################

	private function commitToBlock($commitArray, $modus_color, $all_diff, $pixel, $hohe){

		##### calculate color of the block #####
		$color = $this->commitToColor($modus_color, $commitArray);
		##### Format #####
		##################

		$factor = ($pixel/$hohe) / $all_diff;
		$diff = $commitArray[1];
		$length = ($factor * $diff);

		if ($length < 0.1) $length = 0;
		return array($length, $color[0], $color[1]);
	}

	########################## commitToColor Function ##########################
	##### Computate the color of the blocks                                #####
	##### Input: modus of the color, commitArray (commit message,          #####
	#####        number of changed lines, author and time for all commits) #####
	##### Output: color of the block and key for the legend                #####
	############################################################################

	private function commitToColor($modus, $commitArray){
          date_default_timezone_set ( 'UTC' );
		$conv = new convert();
	
		switch ($modus) {

			###################################################
			## Commit Message encoded in first three letters ##
			###################################################

			case 0:
				$msg = $commitArray[0];

				if ($msg == null) # empty message, grey
					return array(array(211,211,211), "");

				##### replace all non alphanumeric #####
				$msg = preg_replace("/[^a-zA-Z0-9]/" , "" , $msg);
	   			$msg = strtolower($msg);

	    		if (strlen($msg) == 0)				# empty message, grey
	    			return array(array(211,211,211), "");

		   		$first = substr($msg, 0, 1); 		# first letter
		   		$second = substr($msg, 1, 1); 		# second letter
		   		$third = substr($msg, 2, 1); 		# third letter

		   		##### caluclate color ######
				$h = $this->letterValue($first, 0);
		   		if (strlen($msg) > 1){
		   			$s = 0.3 + 0.6 * $this->letterValue ($second, 1);
		   			if (strlen($msg) > 2) {
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

	    		#### convert hsl color into rgb color #####
	    		$convArray = $conv->ColorHSLToRGB($h,$s,$l);
	    		################################ format ################################
	    		##### array with 'r' -> r value, 'g' -> g value and 'b' -> b value #####
	    		########################################################################

	    		$r = $convArray['r'];
		   		$g = $convArray['g'];
		   		$b = $convArray['b'];
		   		$color = array($r,$g,$b);

		    	$txt = $first.$second.$third; # key for the legend

		    	return array($color, $txt);
		    	break;

		   
			####################################
			#### Authorname encoded in hash ####
			####################################

			case 1: 
				$author = $commitArray[2];
				$author = preg_replace("/\"/" , "&quot;" , $author);
				$author = preg_replace("/</", "&lt;", $author);
				$author = preg_replace("/>/", "&gt;", $author);
				$hash = $this->nameToHash($author);
				#### returns h,l and s value #####
	    		
	    		$convArray = $conv->ColorHSLToRGB($hash[0],$hash[1],$hash[2]);
	    		$r = $convArray['r'];
		   		$g = $convArray['g'];
		   		$b = $convArray['b'];
		   		$color = array($r,$g,$b);
		    	return array($color,$author);
				break;

			###################################################
			############## Time of day of commit ##############
			###################################################

			case 2:
				##### get time of commit #####
				$time = $commitArray[3]; 
				$hour = date('G', $time);
				$minute = date('i', $time);

				if ($hour < 12){ # decide am or pm
					$l = 0.35;
				}
				else{
					$l = 0.65;
					//$hour = $hour-12;
				}

				$h = $hour * 0.04;
				$s = 0.39 + 0.01 * $minute;

				$convArray = $conv->ColorHSLToRGB($h,$s,$l);
	    		$r = $convArray['r'];
		   		$g = $convArray['g'];
		   		$b = $convArray['b'];
		   		$color = array($r,$g,$b);
		    	return array($color,""); # no key needed, constant legend
				break;

			###################################################
			################# Date of commit ##################
			###################################################

			case 3:
				###### calculate date of commit ######
				$time = $commitArray[3]; 
				$day  = date('j', $time);
				$month = date('n', $time);
				$year = date('Y', $time);

				$l = 0.1 + $day * 0.01;
				$s = 0.49 + $month * 0.04;
				$h = ($year - 2004) * 0.04; # beginning with 2004

				$convArray = $conv->ColorHSLToRGB($h,$s,$l);
	    		$r = $convArray['r'];
		   		$g = $convArray['g'];
		   		$b = $convArray['b'];
		   		$color = array($r,$g,$b);
		    	return array($color,""); # no key needed, constant legend
				break;

			default:
				error_log("Wrong modus for color"); # should not appear!
				break;
		}
	}

	###################################### Function preprocess ############################################
	##### convert into array of expected order                                                        #####
	##### Input: Object of Commit Interface                                                           #####
	##### Output: array with commit message, number of changed lines, author and time for all commits #####
	####################################################################################################### 

	private function preprocess($obj){

		require_once(__DIR__."/../lib/vcs/Commit.interface.php");
		for ($i = 0; $i < count($obj); $i++){
			$array[$i] = array($obj[$i]->CommitMessage(), $obj[$i]->NumChangedLines(), $obj[$i]->CommitAuthor(), $obj[$i]->CommitTime()) ;
		}
		return $array;
	}

	############ function letterValue #############
	##### calculate value for an alphanumeric #####
	##### Input: alphanumeric                 #####
	##### Ouput: number                       #####
	###############################################

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

	################## function writeBlock ##################
	##### writes a block to an svg image                #####
	##### Input: image, color, corner points and the id #####
	##### Output: nothing                               #####
	######################################################### 

	private function writeBlock($img, $color, $x, $y, $w, $h,$id){
		$conv = new convert();
		$hexcolor = $conv->RGBtoHex($color[0],$color[1],$color[2]);
		$s = " <rect x = \"".$x."\" y =\"".$y."\" width =\"".$w."\" height=\"".$h."\" rx=\"0\" ry=\"0\" id =\"rect".$id."\" style=\"fill:".$hexcolor.";stroke:none\" /> \n";
		fwrite($img, utf8_encode($s));
	}

	#################### function myArraySort #####################
	##### sort an array                                       #####
	##### Input: array with arrays of key, color and quantity #####
	##### Output: sorted array                                #####
	###############################################################

	function myArraySort($array){ //[2] = count
		$array2 = array();
		while(count($array)>0){
			$maxCount = -1;
	   		$maxArray = -1;
	   		for ($i = 0; $i < count($array); $i++){   			
	   			if ($maxCount < $array[$i][2]){
	   				$maxCount = $array[$i][2];
	   				$maxArray = $i;
	   			}
	   		}
	   		$array2[]= $array[$maxArray];
	   		unset($array[$maxArray]);
	   		$array = array_values ($array);
	   	}
    	return $array2;
	}

	################ function nameToHash ################
	##### cumpute the hsl values for an author name #####
	##### Input: name of an author                  #####
	##### Output: array with h, s and l             #####
	#####################################################

	function nameToHash($name){
		$letterArray = array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z");
		$numberArray = array("y", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9");

		##### cut the name to alphanumeric #####
		$name = preg_replace("/[^a-zA-Z0-9]/" , "" , $name);
		$name = strtolower($name);
		$length = strlen($name);

		##### calulate the values of the letters #####
		$value = 0;
		for ($i = 0; $i < $length; $i++){
			$letter = $name[$i];
			if (is_numeric($letter)){
		    	$val = array_search($letter, $numberArray);
		    	$value += ($value * (26/10))-1;
			}
			else{
		    	$value += array_search($letter, $letterArray);
		    }
		}

		##### calculate color #####
		while ($value > 100) {$value = $value/2;}
		$h = $value*0.01;
		$second = substr($name, 0, 1);
		$s = 0.3 + 0.6 * $this->letterValue ($second, 1);
		if ($length > 1){
			$third = substr($name, 1, 1);
			$l = 0.4 + 0.5 * $this->letterValue ($third, 2);
		}
   		else{
			$l = 0.5;
		}

		return array($h,$s,$l);
	}
}
?>


