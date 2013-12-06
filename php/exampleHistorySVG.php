<?php

include("algorithmTest.php");
$algo = new algorithm();
$commitArray = array();
for ($z = 0; $z < 257; $z++){
	$commitArray[] = array(substr(md5(microtime()), mt_rand(0, 24), 8), mt_rand(1, 10));
}
$algo->render($commitArray,0, 500, 500);
echo "<htlm><head></head><body>";
echo "<img src=\"visualization-".session_id().".svg\" />";
echo "</body></html>";
?>