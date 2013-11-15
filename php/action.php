<?php
	session_start();

	$_SESSION['current_progress'] = 0;           //Value to determine the current progress (1-100), will be displayed in the progressbar along with some additional loading infos
	$_SESSION['loading_info'] = 'Loading...';    //Loading infos (ex. 'Requesting repository access), will be displayed
	$_SESSION['loading'] = false;                //if true then the progressbar will be displayed 
	$_SESSION['error_message'] = '';            

	/*
	 * Check formular input
	 */
	if(isset($_POST['projectlink']) && str_replace(' ','',$_POST['projectlink']) != '') {
		$url = $_POST['projectlink'];
	} else {
		$_SESSION['error_message'] = 'Invalid repository url.';
		header('Location: ../render.php');
		exit(1);
	}
	
	if(isset($_POST['history']) && $_POST['history'] == 'true') {
		$history = $_POST['history'];
	}

	$_SESSION['loading'] = true;
	header('Location: ../render.php');

	include("../lib/vcs/git/git.php");	
	include("../php/algorithm.php");
	/*
		* TODO: Call connect to establish connection
		* Then call algorithm to render and refresh the page
	 */
	
?>
