<?php

$datei = fopen("visualization.svg",  "w+");
$s = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>
<svg
	width=\"200px\" height=\"200px\" version=\"1.1\" id=\"test\"
	xmlns:svg=\"http://www.w3.org/2000/svg\"> ";

fwrite($datei, $s);

$array=array(255,0,0);

writeBlock($datei, $array, 12, 12, 20, 10);

fwrite($datei, "</svg>");
fclose($datei);


function writeBlock($datei, $color, $x, $y, $w, $h){
	#fopen($datei);
$s = "
<rect 	x = \"".$x."\" y =\"".$y."\" width =\"".$w."\" height=\"".$h."\"
		rx=\"0\" ry=\"0\" fill=\"rgb(".$color[0].",".$color[1].",".$color[2].")\"
		stroke=\"none\"
		stroke-width=\"0\"
		id =\"rect\"/>
";

fwrite($datei, $s);
#fclose($datei);
}
?>