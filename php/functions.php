<?php
function initSession ($debug){
	$_SESSION['loading_info'] = 'Not loading';
	$_SESSION['progress'] = 0;
	$_SESSION['error_message'] = '';
	$_SESSION['title'] = '';
	$_SESSION['repourl'] = '';
	$_SESSION['finish'] = 0;
	$_SESSION['width'] = 768;
	$_SESSION['height'] = 512;
	$_SESSION['image'] = '';
	$_SESSION['ajax_called'] = 0;
if (isset($debug)){
	error_log($_SESSION['loading_info']. " ".
	$_SESSION['progress']." ".
	$_SESSION['error_message']." ".
	$_SESSION['title']." ".
	$_SESSION['repourl']." ".
	$_SESSION['finish']." ".
	$_SESSION['width']." ".
	$_SESSION['height']." ".
//	$_SESSION['image']." ".
	$_SESSION['ajax_called']
 );
	}
}

function dump(){
	error_log($_SESSION['loading_info']. " ".
	$_SESSION['progress']." ".
	$_SESSION['error_message']." ".
	$_SESSION['title']." ".
	$_SESSION['repourl']." ".
	$_SESSION['finish']." ".
	$_SESSION['width']." ".
	$_SESSION['height']." "
 );

}
?>
