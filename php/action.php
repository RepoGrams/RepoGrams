<?php
	session_start();
	
	require_once(__DIR__."/../lib/vcs/RepoFactory.class.php");
	require_once("algorithm.php");

	/**
	 * Check the formular input and start rendering
	 */
	initVariables();
	$_SESSION['repourl'] = $_POST['projectlink'];
	if (checkInput($_SESSION['repourl'])) {
		renderRepo($_SESSION['repourl']);
		header('Location: loading.php');
	}
	
	/**
	 * Callback function to update progress info
	 * @param string $msg
	 * @return NULL
	 */
	function callback($msg = null) {
		$_SESSION['loading_info'] = $msg;
		header('Location: ../loading.php');  
		return null;
	}
	
	/**
	 * Initialize session variables
	 */
	function initVariables() {
		$_SESSION['loading_info']     = 'Loading...';   
		$_SESSION['error_message']    = '';     
		$_SESSION['title']            = ''; 
		$_SESSION['repourl']          = '';
		$_SESSION['finish']           = false;
		
		$_SESSION['width']  = 768;                                   
		$_SESSION['height'] = 512;                                 
	}
	
	/**
	 * Check formular input if url is empty
	 */
	function checkInput($repourl = null) {
		if(!str_replace(' ','',$repourl) != '') {
			$_SESSION['error_message'] = 'Invalid repository url.';
			header('Location: ../index.php');
			return false;
		} else {
			return true;
		}
	}
	
	/**
	 * Renders the repository with the provided $repourl and displays the image on image.php
	 * Session-Variables: image, title, error_message, 
	 */
	function renderRepo($repourl = null) {
		try {
			$repo = RepoFactory::createRepo($repourl);
			$alg = new Algorithm();
			$arr = $alg->render($repo->getAllCommits(), 0,$_SESSION['width'], $_SESSION['height']);
			$_SESSION['image'] = $arr;
			$start = strrpos($repourl, '/');
			$_SESSION['title'] = substr($repourl, $start+1, strrpos($repourl, '.')-$start-1);
			unsetAll();
			$_SESSION['finish'] = true;
			return null;
		} catch (Exception $e) {
			unsetAll();
			$_SESSION['error_message'] = $e->getMessage();
			header('Location: ../index.php');  
			$_SESSION['finish'] = false;
		}
	}

	/**
	 * Unsets session variables: error_message, current_progress, loading, loading_info
	 */
	function unsetAll() {
		unset($_SESSION['error_message']);
		unset($_SESSION['loading_info']);
	}
	
?>
