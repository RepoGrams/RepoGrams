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
	error_log($_SESSION['progress']." ".
	$_SESSION['error_message']." ".
	$_SESSION['title']." ".
	$_SESSION['repourl']." ".
	$_SESSION['finish']." ".
	$_SESSION['width']." ".
	$_SESSION['height']." "
 );
}

function renderImage(){
	for ($i = 1; $i < count($_SESSION['image']); $i++){
		renderBlock($_SESSION['image'][$i], $i);
	}
}

function renderBlock($commit, $index){
	$color = buildColor($commit[2]);$_SESSION['image'];
	$style = 'style="background-color:rgb('.ceil($commit[2][0]).','.ceil($commit[2][1]).','.ceil($commit[2][2]).'); width:'.($commit[0]).'px; height:16px;"';
	$datum = date("H:i:s - m.d.y", $commit[4]);
	$effect = 'title="'.$commit[3].' by '.$commit[5]. ' on '. $datum.'"'; 
	$head = '<li class="customBlock" id="'.$index.'" '.$style.' '.$effect.'>';
	$end = '</li>';
	echo ($head);
	echo ($end);
}

function buildColor($color){
	$ret = $color[0];
	$ret << 4;
	$ret = $ret || $color[1];
	$ret << 4;
	$ret = $ret || $color[2];
}

function renderLegend(){
	$legend = $_SESSION['image'][0];
	while( list ( $key, $val ) = each ( $legend ) )
	{
		    echo $key.' ' . $val . '<br>';
	}
}
?>
