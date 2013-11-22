<?php

Header("Content-Type: image/png"); 
include("algorithmTest.php");
$algo = new algorithm();

/*$m00 = array ("aaa", 12);
$m01 = array ("bbb", 11);
$m02 = array ("ccc", 100);
$m03 = array ("ddd", 120);
$m04 = array ("eee", 19);
$m05 = array ("fff", 39);
$m06 = array ("ggg", 86);
$m07 = array ("hhh", 98);
$m08 = array ("iii", 124);
$m09 = array ("jjj", 531);
$m11 = array ("kkk", 86);
$m12 = array ("lll", 35);
$m13 = array ("mmm", 86);
$m14 = array ("nnn", 184);
$m15 = array ("ooo", 35);
$m16 = array ("ppp", 8);
$m17 = array ("qqq", 63);
$m18 = array ("rrr", 12);
$m19 = array ("sss", 168);
$m20 = array ("ttt", 12);
$m21 = array ("uuu", 11);
$m22 = array ("vvv", 100);
$m23 = array ("www", 120);
$m24 = array ("xxx", 19);
$m25 = array ("yyy", 39);
$m26 = array ("zzz", 86);*/

/*$m00 = array ("aa", 12);
$m01 = array ("bb", 11);
$m02 = array ("cc", 100);
$m03 = array ("dd", 120);
$m04 = array ("ee", 19);
$m05 = array ("ff", 39);
$m06 = array ("gg", 86);
$m07 = array ("hh", 98);
$m08 = array ("ii", 124);
$m09 = array ("jj", 531);
$m11 = array ("kk", 86);
$m12 = array ("ll", 35);
$m13 = array ("mm", 86);
$m14 = array ("nn", 184);
$m15 = array ("oo", 35);
$m16 = array ("pp", 8);
$m17 = array ("qq", 63);
$m18 = array ("rr", 12);
$m19 = array ("ss", 168);
$m20 = array ("tt", 12);
$m21 = array ("uu", 11);
$m22 = array ("vv", 100);
$m23 = array ("ww", 120);
$m24 = array ("xx", 19);
$m25 = array ("yy", 39);
$m26 = array ("zz", 86);*/

/*$m00 = array ("a", 12);
$m01 = array ("b", 11);
$m02 = array ("c", 100);
$m03 = array ("d", 120);
$m04 = array ("e", 19);
$m05 = array ("f", 39);
$m06 = array ("g", 86);
$m07 = array ("h", 98);
$m08 = array ("i", 124);
$m09 = array ("j", 531);
$m11 = array ("k", 86);
$m12 = array ("l", 35);
$m13 = array ("m", 86);
$m14 = array ("n", 184);
$m15 = array ("o", 35);
$m16 = array ("p", 8);
$m17 = array ("q", 63);
$m18 = array ("r", 12);
$m19 = array ("s", 168);
$m20 = array ("t", 12);
$m21 = array ("u", 11);
$m22 = array ("v", 100);
$m23 = array ("w", 120);
$m24 = array ("x", 19);
$m25 = array ("y", 39);
$m26 = array ("z", 86);*/

/*$m00 = array ("a", 12);
$m01 = array ("bb", 11);
$m02 = array ("c", 100);
$m03 = array ("dd", 120);
$m04 = array ("e", 19);
$m05 = array ("ff", 39);
$m06 = array ("g", 86);
$m07 = array ("hh", 98);
$m08 = array ("i", 124);
$m09 = array ("jj", 531);
$m11 = array ("k", 86);
$m12 = array ("ll", 35);
$m13 = array ("m", 86);
$m14 = array ("nn", 184);
$m15 = array ("o", 35);
$m16 = array ("pp", 8);
$m17 = array ("q", 63);
$m18 = array ("rr", 12);
$m19 = array ("s", 168);
$m20 = array ("tt", 12);
$m21 = array ("u", 11);
$m22 = array ("vv", 100);
$m23 = array ("w", 120);
$m24 = array ("xx", 19);
$m25 = array ("y", 39);
$m26 = array ("zz", 86);*/

$m00 = array ("0", 80);
$m01 = array ("1", 20);
$m02 = array ("2", 20);
$m03 = array ("3", 20);
$m04 = array ("4", 20);
$m05 = array ("5", 20);
$m06 = array ("6", 20);
$m07 = array ("7", 20);
$m08 = array ("8", 20);
$m09 = array ("9", 20);

#$commitArray = array($m00, $m01, $m02, $m03, $m04, $m05, $m06, $m07, $m08, $m09, $m11, $m12, $m13, $m14, $m15, $m16, $m17, $m18, $m19, $m20, $m21, $m22, $m23, $m24, $m25, $m26);
$commitArray = array($m00, $m01, $m02, $m03, $m04, $m05, $m06, $m07, $m08, $m09);
############################################
############################################
############################################

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
				$color = $algo->commitToColor($modus, $str, $img);
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
		ImagePNG($img); 
		ImageDestroy($img);
?>