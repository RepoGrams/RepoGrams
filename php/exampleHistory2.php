<?php

include("algorithmTest.php");
$algo = new algorithm();
$m00 = array ("add blubb", 100);
$m01 = array ("delete", 100);
$m02 = array ("fix", 100);

$m03 = array ("add delete", 100);
$m04 = array ("add fix", 100);
$m05 = array ("remove bug", 100);
$m06 = array ("add delete fix", 100);

$m07 = array ("add new remove", 100);
$m08 = array ("create delete remove", 100);

$m09 = array ("add new fix", 100);
$m11 = array ("new fix bug", 100);

$m12 = array ("delete remove fix", 100);
$m13 = array ("delete fix bug", 100);

$m14 = array ("add new delete fix", 100);
$m15 = array ("add delete remove bug", 100);
$m16 = array ("add delete bug fix", 100);

$m17 = array ("added", 100);
$m18 = array ("Add", 100);
$m19 = array ("undo", 100);

$input = array($m00, $m01, $m02, $m03, $m04, $m05, $m06, $m07, $m08, $m09, $m11, $m12, $m13, $m14, $m15, $m16, $m17, $m18, $m19);
$algo->render($input,1);
echo "<htlm><head></head><body>";
echo "<img src=\"visualization.png\" />";
echo "</body></html>";
?>