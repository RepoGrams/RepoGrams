<?php
require_once("./newAlgorithm.php");
session_start();
error_log('HELP');
if (isset($_GET['filter1'])) {
	$mode = $_GET['filter1'];
	$var = 0;
	switch ($mode) {
		case "0": $var = 0;break;
		case "1": $var = 1;break;
		case "2": $var = 2;break;
		case "3": $var = 3;break;
		case "4": $var = 4;break;
	}	
	error_log($fmode.' is set to render');
	$alg = new Algorithm();
	$ses = unserialize($_SESSION['repo']);
	$_SESSION['image'] = $alg->render($ses,0,$var,$_SESSION['width'], $_SESSION['height']);
	error_log("Rendered");
	header('Location: ../image.php');
}
	
?>
