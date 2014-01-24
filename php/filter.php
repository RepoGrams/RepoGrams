<?php
require_once("./newAlgorithm.php");

if (isset($_GET['filter1'])) {
	$mode = $_GET['filter1'];
	renderImage(0, $mode);
} else if (isset($_GET['filter2'])) {
	$mode = $_GET['filter2'];
	renderImage(1, $mode);
}	
error_log("Test");
reRender(1,1);
function reRender($fmode = null, $smode = null) {
	error_log($fmode.' is set to render');
	$alg = new Algorithm();
	$_SESSION['image'] = $alg->render($ses,$fmode,$smode,$_SESSION['width'], $_SESSION['height']);
	error_log("Rendered");
	header('Location: ../image.php');
}
	
?>
