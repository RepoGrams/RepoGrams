<?php
error_reporting(-1);
require_once('./php/utils.php');
require_once('./config.inc.php');
startSessionIfNotStarted();
$allowedExtensions = array("svg","png","pdf","jpeg","jpg");

if (session_id() == ''){
	die("Error: Image could not be generated, as no Session is started.");
}

if (isset($_GET['mode']) && (!is_null($_GET['mode']))){
	$modeDownload = $_GET['mode'];
} else {
	$modeDownload = 'svg';
}

// Sanitize input
if (!in_array(strtolower($modeDownload),$allowedExtensions)){
	die("Extension requested is not available");
}

if (strtolower($modeDownload) != 'svg'){
	convertImage($modeDownload);
}

download_file($modeDownload);


function convertImage($modeDownload) {
	$image = new Imagick(_IMAGEDIR.'visualization-'.session_id().'.svg');
	if($modeDownload == "png")
		$image->setImageFormat("png");
	else if ($modeDownload == "jpeg" || $modeDownload == "jpg")
		$image->setImageFormat("jpg");
	else if ($modeDownload == "pdf")
		$image->setImageFormat("pdf");
	
	$image->writeImage(_IMAGEDIR.'visualization-'.session_id().'.'.$modeDownload);
}

function download_file($modeDownload){
	header('Location: /'.basename(_IMAGEDIR).'/visualization-'.session_id().'.'.$modeDownload);
	exit;
}
