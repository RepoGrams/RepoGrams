<?php

/*
 * Initializes the session by setting all needed variables to default values.
 * If it is called with an arbitrary debug value, it will print all values 
 * to the web servers error log.
 *
 */
function initSession ($debug){
	$_SESSION['progress'] = 0;
	$_SESSION['title'] = '';
	$_SESSION['repourl'] = '';
	$_SESSION['finish'] = 0;
	$_SESSION['width'] = 768;
	$_SESSION['height'] = 512;
	$_SESSION['image'] = '';
if (isset($debug)){
	error_log($_SESSION['progress']." ".
	$_SESSION['error_message']." ".
	$_SESSION['title']." ".
	$_SESSION['repourl']." ".
	$_SESSION['finish']." ".
	$_SESSION['width']." ".
	$_SESSION['height']." "
 );
	}
}

/*
 * Debug function. Can be used to dump the content of the session variables at any time.
 *
 */
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

/*
 * Function that renders the image from the image array created by the algorithm.
 * It assumes that the session variable $_SESSION['image'] has been set to such an
 * object.
 * It calls renderBlock for every block of the given image, except the first.
 * The first block contains the legend which is handeled separately.
 */
function renderImage(){
	$count = 1;
	for ($i = 1; $i < count($_SESSION['image']); ++$i){
		$count = renderBlock($_SESSION['image'][$i], $count);
	}
}

/*
 * Renders one block array from the image array created by the algorithm.
 * Each block is rendered by the render function.
 *
 * @param $block, the block of the image array, as array
 * @param $count, the last set id of a block
 */
function renderBlock($block, $count){
	$width = 0;
	for ($i = 0; $i < count($block); $i++){
		if($i == count($block)-1){
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

/*
 * Renders one block. As we get floating point number from the algorithm we need to do some alignment here.
 * We count the width of the current row, to set the last block to the difference.
 *
 * @param $commit, the array containing all computed values from the algorithm. It's length should be 6.
 * 		$commit[0] = width
 * 		$commit[1] = height
 * 		$commit[2] = array of three numbers, representing the colour of the block
 * 		$commit[3] = commit message
 * 		$commit[4] = time
 * 		$commit[5] = author
 * @param $id, the blocks id
 * @param $width, the width of the blocks rendered so far
 *
 */
function render($commit, $id, $width){
	//compute values to decide what is nearer to the value: floor or ceil
	//to be as precise as possible
	$floorValue = floor($commit[0]);
	$ceilValue = ceil($commit[0]);
	$floorDiff = $commit[0] - $floorValue;
	$ceilDiff = $ceilValue - $commit[0];

	date_default_timezone_set ( 'UTC' );
	$datum = date("H:i:s - m.d.y", $commit[4]);

	//generate the tooltip of the final block
	$tooltip = 'data-html="true" data-original-title="Author: '.$commit[5].'<br>
			                                          Date: '. $datum.'<br>
			                                          Comment: '.$commit[3].'" data-placement="right" rel="tooltip"';
	//generate the block with the most precision
	if($floorDiff < $ceilDiff){ //we want to floor the value
		$style = 'style="background-color:rgb('.ceil($commit[2][0]).','.ceil($commit[2][1]).','.ceil($commit[2][2]).'); width:'.($floorValue).'px; height:'.$commit[1].'px;"';
		$head = '<li class="customBlock" id="'.$id.'" '.$style.' '.$tooltip.'>';
		echo ($head);
		$width += $floorValue;
	}else{ //we want to ceil the value
		$style = 'style="background-color:rgb('.ceil($commit[2][0]).','.ceil($commit[2][1]).','.ceil($commit[2][2]).'); width:'.($ceilValue).'px; height:'.$commit[1].'px;"';
		$head = '<li class="customBlock" id="'.$id.'" '.$style.' '.$tooltip.'>';
		echo ($head);
		$width += $ceilValue;
	}
	//finish the list item
	$end = '</li>';
	echo ($end);
	//return the new width of the row
	return $width;
}

/*
 * This function is used to render the last block of a row, as this block needs special handling.
 * @param see render function
 */
function renderLast($commit, $count, $width){
	//compute the size that is available for the block and use this one instead of the
	//value saved in the array
	$size = $_SESSION['width'] - $width;
	$style = 'style="background-color:rgb('.ceil($commit[2][0]).','.ceil($commit[2][1]).','.ceil($commit[2][2]).'); width:'.($size).'px; height:'.$commit[1].'px;"';

	date_default_timezone_set ( 'UTC' );
	$datum = date("H:i:s - m.d.y", $commit[4]);
	$tooltip = 'data-html="true" data-original-title="Author: '.$commit[5].'<br>
			                                          Date: '. $datum.'<br>
			                                          Comment: '.$commit[3].'" data-placement="right" rel="tooltip"';
	$head = '<li class="customBlock" id="'.$count.'" '.$style.' '.$tooltip.'>';
	$end = '</li>';
	echo ($head);
	echo ($end);
}

/*
 * Renders the legend taken from the first element of the image array
 */
function renderLegend(){
	//save to variable
	$legend = $_SESSION['image'][0];
	//iterate over all items
	for ( $i = 0; $i < count($legend); $i++)
	{
		//take the values and create html code
		$key = $legend[$i][0];
		$val = $legend[$i][1];
		$colorBlock = '<div style="line-height:1"><div class="customBlock" onmouseover="highlightBlocks();" onmouseleave="unhighlightBlocks();" style="background-color:rgb('.ceil($val[0]).','.ceil($val[1]).','.ceil($val[2]).');width:15px;height:14px;">';
		echo $colorBlock .'</div>'.'&nbsp;'.$key.'<br></div>';
	}
}
?>
