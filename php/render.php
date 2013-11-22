<?php 
Header("Content-Type: image/png"); 
# Hier wird der Header gesendet, der später die Bilder "rendert" ausser png kann auch jpeg dastehen 

################################################## 
$width = 1000; # Später die Breite des Rechtecks 
$height = 990; # Später die Höhe des Rechtecks 
$img = ImageCreate($width, $height); # Hier wird das Bild einer Variable zu gewiesen 
################################################## 

################################################## 
$black = ImageColorAllocate($img, 0, 0, 0); # Hier wird die Farbe schwarz einer Variable zugewiesen 
$grun = ImageColorAllocate($img, 155, 200, 30);
$red = ImageColorAllocate($img, 200, 0, 0); # Hier wird die Farbe rot einer Vaiable zugewiesen 
$yellow = ImageColorAllocate($img, 200, 200, 0); # Hier wird die Farbe gelb einer Variable zugewiesen 
#$grun = ImageColorAllocate($img, 155, 200, 30);
$pink = ImageColorAllocate($img, 200, 20, 200);
################################################## 


################################################## 
ImageFill($img, 0, 0, $pink);
#ImageFilledRectangle($img, 0, 0, 100, 100, $yellow); # Erst wird das Bild mit gelb gefüllt. 
#ImageFilledRectangle($img, 101, 0, 200, 100, $black); # Mit ImageFillRectangle wird ein weiter Bereich des Bildes mit schwarz gefüllt 
# Ecke oben links:
# Die 1. 0 ist die Entfernung in px von Links. 
# Die 2. 0 ist die Entfernung in px von Oben. 
# Ecke oben rechts:
# Die 300 ist die Breite der Farbe. 
# Die 100 ist die Höhe der Farbe. 
#ImageFilledRectangle($img, 201, 0, 300, 100, $red); 
# Hier die gleichen Sachen wie bei der Schwarzfüllung, nur mit anderen Koordinaten und anderer Farbe. 
#ImageFilledRectangle($img, 0, 101, 100, 200, $grun); 
################################################## 


 $colorArray = array($grun, $red, $black, $yellow, $grun, $black, $red, $black, $yellow, $grun, $yellow, 
 	$red, $black, $yellow, $grun, $red, $black, $yellow, $grun, $red, $black, $yellow, $grun, $black, $red, 
 	$black, $yellow, $grun, $yellow, $red, $grun, $red, $black, $yellow, $grun, $black, $red, $black, $yellow, 
 	$grun, $yellow, $red, $grun, $red, $black, $yellow, $grun, $black, $red, $black, $yellow, $grun, $yellow, 
 	$red, $grun, $red, $black, $yellow, $grun, $black, $red, $black, $yellow, $grun, $yellow, $red, $grun, $red, 
 	$black, $yellow, $grun, $black, $red, $black, $yellow, $grun, $yellow, $red, $grun, $red, $black, $yellow, 
 	$grun, $black, $red, $black, $yellow, $grun, $yellow, $red, $grun, $red, $black, $red, $grun, $red, $black, 
 	$yellow, $grun, $black, $red, $black, $yellow, $red, $grun, $red, $black, $grun, $yellow, $red, $grun, $red, 
 	$black, $yellow, $red, $grun, $red, $black, $grun, $black, $red, $grun, $red, $black, $red, $black, $yellow, 
 	$grun, $yellow, $red, $grun, $red, $black, $yellow, $grun, $black, $red, $black, $yellow, $grun, $yellow, $red);

			$x = 0; 	#links oben -> links
			$y = 0; 	#links oben -> oben
			$hohe = 15; 	#rechts unten -> links BREITE
			$z = $hohe;	#rechts unten -> oben HÖHE

			$count = 100;
			$diff = 7;
			$diff2 = 700; 
			$pixel = $width * $height;
			$factor = ($pixel/$hohe) / $diff2;

			for ($i = 0; $i < $count; $i++){

				$color = $colorArray[$i];
 		 		$k++;
 		 		$k = $k % 4;
 		 		$w = ($x+($diff*$factor));
				ImageFilledRectangle($img, $x, $y, $w, $z, $color);

				if ($w > $width){
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
// 			$count = 16;
			// $k = 0;
 		// 	for ($i = 0; $i < $height; $i+=31){
 		// 		for ($j = 0; $j < $width; $j+=31){
 		// 		$color = $colorArray[$k];
 		// 		$k++;
 		// 		$k = $k % 4;
 				// ImageFilledRectangle($img, $j, $i, $j+30, $i+30, $color); 
 				// if($j + 30 > $width){
 				// 	$overlap = ($j + 30) - $width;
 				// 	$i += 30;
 				// 	ImageFilledRectangle($img, 0, $i, $j+30, 30, $color); 
 				// 	$j = $overlap;
 				// 	break;
 				// }

// 				$x += $w+1;
// 				$w += $w+1;

// 				// if ($x > $width){
// 				// 	$x = 0;
// 				// 	$y += $z+1;
// 				// 	$w += 0;
// 				// 	if ($y > $height){
// 				// 		#echo "Error: To many commits for this height. " + $i + " of " + $count + " commits.";
// 				// 	}
// 				// }
 			// 	}
 			// }
##################################################
ImagePNG($img); 
ImageDestroy($img) # Hier wird der Speicherplatz für andere Sachen geereinigt 
?>