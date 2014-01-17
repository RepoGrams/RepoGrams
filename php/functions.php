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

function renderImage(){
	$array = $_SESSION['image'];
	$width = 0;
	foreach ($array as $commit){
		$width += $commit[0];
		renderBlock($commit);
		if($width >= $_SESSION['width'])
			echo("<br>");
	}
}

function renderBlock($commit){
	$color = buildColor($commit[2]);
	$style = 'style="background-color:rgb('.floor($commit[2][0]).','.floor($commit[2][1]).','.floor($commit[2][2]).'); width:'.floor($commit[0]).'px; height:'.floor($commit[1]).'px;"';
	error_log($style);
	$effect = ''; 
	$head = '<div class="customBlock" '.$style.' '.$effect.'>';
	$end = '</div>';
	echo ($head);
	echo ($commit[3]);
	echo ($end);
}

function buildColor($color){
	$ret = $color[0];
	$ret << 4;
	$ret = $ret || $color[1];
	$ret << 4;
	$ret = $ret || $color[2];

}
?>
