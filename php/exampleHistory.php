<?php

include("algorithm.php");
$algo = new algorithm();
$m00 = array ("add", 12);
$m01 = array ("rev", 11);
$m02 = array ("clo", 100);
$m03 = array ("new", 120);
$m04 = array ("add", 19);
$m05 = array ("aus", 39);
$m06 = array ("asd", 86);
$m07 = array ("adf", 98);
$m08 = array ("add", 124);
$m09 = array ("iuf", 531);
$m11 = array ("udj", 86);
$m12 = array ("asd", 35);
$m13 = array ("add", 86);
$m14 = array ("add", 184);
$m15 = array ("new", 35);
$m16 = array ("ifv", 8);
$m17 = array ("ius", 63);
$m18 = array ("idf", 12);
$m19 = array ("inj", 168);

$input = array($m00, $m01, $m02, $m03, $m04, $m05, $m06, $m07, $m08, $m09, $m11, $m12, $m13, $m14, $m15, $m16, $m17, $m18, $m19);
$algo->render($input,0);
echo "<htlm><head></head><body>";
echo "<img src=\"name.png\" />";
echo "</body></html>";
?>