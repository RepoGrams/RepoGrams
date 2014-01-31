<?php

$file = $_GET['file'];
$mode = $_GET['mode'];

if (isset($_GET['mode'])) convertImage();
download_file($file);
header('location: '.$_SERVER['HTTP_REFERER']);


function convertImage() {
	$image = new Imagick();
	$image->readImage(_IMAGEDIR.'visualization-'.session_id().'.svg');
	switch ($mode) {se "png": $image->setImageFormat("png24"); break;
		case "jpeg": 
		case "jpg": $image->setImageFormat("jpg"); break;
	}
	$image->resizeImage($_SESSION["width"]*2, $_SESSION["height"]*2, imagick::FILTER_LANCZOS, 1);
	$image->writeImage(_IMAGEDIR.'visualization-'.session_id().'.'.$mode);
}

function download_file( $fullPath ){

  // Must be fresh start
  if( headers_sent() )
    die('Headers Sent');

  // Required for some browsers
  if(ini_get('zlib.output_compression'))
    ini_set('zlib.output_compression', 'Off');

  // File Exists?
  if( file_exists($fullPath) ){

    // Parse Info / Get Extension
    $fsize = filesize($fullPath);
    $path_parts = pathinfo($fullPath);
    $ext = strtolower($path_parts["extension"]);

    // Determine Content Type
    switch ($ext) {
      case "png": $ctype="image/png"; break;
      case "jpeg":
      case "jpg": $ctype="image/jpg"; break;
      case "svg": $ctype="image/svg"; break;
      default: $ctype="application/force-download";
    }

    header("Pragma: public"); // required
    header("Expires: 0");
    header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
    header("Cache-Control: private",false); // required for certain browsers
    header("Content-Type: $ctype");
    header("Content-Disposition: attachment; filename=\"".basename($fullPath)."\";" );
    header("Content-Transfer-Encoding: binary");
    header("Content-Length: ".$fsize);
    ob_clean();
    flush();
    readfile( $fullPath );

  } else
    die('File Not Found');

}
?>
