<?php
	session_start();
//unset($_SESSION['loading']);
	$_SESSION['current_progress'] = 0;           //Value to determine the current progress (1-100), will be displayed in the progressbar along with some additional loading infos
	$_SESSION['loading_info'] = 'Loading...';    //Loading infos (ex. 'Requesting repository access), will be displayed
	$_SESSION['loading'] = false;                //if true then the progressbar will be displayed 
	$_SESSION['error_message'] = '';   
	$width = $height = 512; 


class action{        

	
	public function callback($msg = null) {
		$_SESSION['current_progress'] = $_SESSION['current_progress']+20;
		$_SESSION['loading_info'] = $msg;
		header('Location: ../render.php');
	}
}
	$_SESSION['action'] = new action();	
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

	echo "Blablablub";

	include("../lib/vcs/RepoFactory.class.php");
	include("algorithm.php");

	echo "Include successfull";	
	try {
		echo "Accessing repo";
		$repo = RepoFactory::createRepo($url, $_SESSION['action']->callback());
		echo "Access !";
		$alg = new Algorithm();
		$arr = $alg->render($repo->getAllCommits(), 0, $width, $height, 'callback');
		$_SESSION['image'] =$arr;
		unset($_SESSION['loading']);
		header('Location: ../render.php');
	} catch (Exception $e) {
		$_SESSION['error_message'] = $e->getMessage();
		unset($_SESSION['current_progress']);
		unset($_SESSION['loading']);
		unset($_SESSION['loading_info']);
		header('Location: ../render.php');
		exit(2);
	}
	
	
?>
