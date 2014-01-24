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
	$count = 1;
	for ($i = 1; $i < count($_SESSION['image']); ++$i){
		$count = renderBlock($_SESSION['image'][$i], $count);
	}
}

function renderBlock($block, $count){
	$width = 0;
	for ($i = 0; $i < count($block); $i++){
		if($i == count($block)){
			renderLast($block[$i], $count, $width);
			$count++;
			$width = 0;
		}else{
			$width = render($block[$i], $count, $width);
			$count++;
		}
	}
	return $count;
}

function render($commit, $id, $width){
	//compute values to decide what is nearer to the value: floor or ceil
	$floorValue = floor($commit[0]);
	$ceilValue = ceil($commit[0]);
	$floorDiff = $commit[0] - $floorValue;
	$ceilDiff = $ceilValue - $commit[0];

	$color = buildColor($commit[2]);$_SESSION['image'];
	$datum = date("H:i:s - m.d.y", $commit[4]);
	$tooltip = 'data-html="true" data-original-title="Author: '.$commit[5].'<br>
			                                          Date: '. $datum.'<br>
			                                          Comment: '.$commit[3].'" data-placement="right" rel="tooltip"';

	if($floorDiff < $ceilDiff){ //we want to floor the value
		$style = 'style="background-color:rgb('.ceil($commit[2][0]).','.ceil($commit[2][1]).','.ceil($commit[2][2]).'); width:'.($floorValue).'px; height:16px;"';
		$head = '<li class="customBlock" id="'.$id.'" '.$style.' '.$tooltip.'>';
		echo ($head);
		$width += $floorValue;
	}else{ //we want to ceil the value
		$style = 'style="background-color:rgb('.ceil($commit[2][0]).','.ceil($commit[2][1]).','.ceil($commit[2][2]).'); width:'.($ceilValue).'px; height:16px;"';
		$head = '<li class="customBlock" id="'.$id.'" '.$style.' '.$tooltip.'>';
		echo ($head);
		$width += $ceilValue;
	}
	$end = '</li>';
	echo ($end);
	return $width;
}

function renderLast($commit, $count, $width){
	$size = $_SESSION['width'] - $width;
	$color = buildColor($commit[2]);$_SESSION['image'];
	$style = 'style="background-color:rgb('.ceil($commit[2][0]).','.ceil($commit[2][1]).','.ceil($commit[2][2]).'); width:'.($size).'px; height:16px;"';
	
	$tooltip = 'data-html="true" data-original-title="Author: '.$commit[5].'<br>
			                                          Date: '. $datum.'<br>
			                                          Comment: '.$commit[3].'" data-placement="right" rel="tooltip"';
	$datum = date("H:i:s - m.d.y", $commit[4]);
	$head = '<li class="customBlock" id="'.$index.'" '.$style.' '.$tooltip.'>';
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
	for ( $i = 0; $i < count($legend); $i++)
	{
		$key = $legend[$i][0];
		$val = $legend[$i][1];
		$colorBlock = '<div style="line-height:1"><div class="customBlock" style="background-color:rgb('.ceil($val[0]).','.ceil($val[1]).','.ceil($val[2]).');width:15px;height:14px;">';
		echo $colorBlock .'</div>'.'&nbsp;'.$key.'<br></div>';
	}
}
?>
