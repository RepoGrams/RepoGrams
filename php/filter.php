<?php
require_once("./newAlgorithm.php");

if (isset($_GET['filter1'])) {
	$mode = $_GET['filter1'];
	switch ($mode) {
		case "0": renderImage(0, $mode);break;
		case "1": renderImage(0, $mode);break;
		case "2": renderImage(0, $mode);break;
		case "3": renderImage(0, $mode);break;
		case "4": renderImage(0, $mode);break;
		case "5": renderImage(1, 0);break;
		case "6": renderImage(1, 1);break;
		case "7": renderImage(1, 2);break;
	}
}	

error_log("Test");
reRender(0,4);

function reRender($fmode = null, $smode = null) {
	error_log($fmode.' is set to render');
	$alg = new Algorithm();
	$ses = unserialize($_SESSION['repo']);
	$_SESSION['image'] = $alg->render($ses,$fmode,$smode,$_SESSION['width'], $_SESSION['height']);
	error_log("Rendered");
	header('Location: ../image.php');
}
	
?>
