<?php

	$current_progress = 0;           //Value to determine the current progress (1-100), will be displayed in the progressbar along with some additional loading infos
	$loading_info = 'Loading...';    //Loading infos (ex. 'Requesting repository access), will be displayed
	$loading = false;                //if true then the progressbar will be displayed             

	/*
	 * Check formular input
	 */
	if(isset($_POST['projectlink']) && str_replace(' ','',$_POST['projectlink']) != '') {
		$url = $_POST['projectlink'];
	} else {
		$error = true;
		$error_message = "Invalid repository url.";
		header('Location: ../render.php?error='.$error.'&error_message='.$error_message);
		exit(1);
	}
	
	if(isset($_POST['history']) && $_POST['history'] == 'true') {
		$history = $_POST['history'];
	}

	$loading = true;
	header('Location: ../render.php?loading='.$loading.'&current_progress='.$current_progress.'&loading_info='.$loading_info);

	include("../lib/vcs/git/git.php");	
	include("../php/algorithm.php");
	/*
		* TODO: Call connect to establish connection
		* Then call algorithm to render and refresh the page
	 */
	
?>
