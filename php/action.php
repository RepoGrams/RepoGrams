<?php
	session_start();
	
	require_once(__DIR__."/../lib/vcs/RepoFactory.class.php");
	require_once("algorithm.php");
	
	$_SESSION['current_progress'] = 0;               //Value to determine the current progress (1-100), will be displayed in the progressbar along with some additional loading infos
	$_SESSION['loading_info']     = 'Loading...';    //Loading infos (ex. 'Requesting repository access), will be displayed
	$_SESSION['loading']          = false;           //if true then the progressbar will be displayed 
	$_SESSION['error_message']    = '';              //Error message will be set if an error occurs and displayed on the page
	$_SESSION['title']            = '';              //Repository title, will be displayed on the final image page
	$_SESSION['action']           = new action();    //Callback function, used to display progress
	
	$width  = 768;                                   //Image width
	$height = 512;                                   //Image height


class action{        
	
	public function callback($msg = null) {
		$_SESSION['current_progress'] = $_SESSION['current_progress']+20;
		$_SESSION['loading_info'] = $msg;
		header('Location: ../index.php');
	}
	
}
	/**
	 * Check the formular input and start rendering
	 */
	$url = $_POST['projectlink'];
	checkInput($url);
	renderRepo($url);
	
	/**
	 * Check formular input if url is empty
	 */
	function checkInput($repourl = null) {
		if(!str_replace(' ','',$repourl) != '') {
			$_SESSION['error_message'] = 'Invalid repository url.';
			header('Location: ../index.php');
			exit(1);
		}
	}
	
	/**
	 * Renders the repository with the provided $repourl and displays the image on image.php
	 * Session-Variables: image, title, error_message, action
	 */
	function renderRepo($repourl = null) {
		try {
			$_SESSION['loading'] = true;
			$repo = RepoFactory::createRepo($repourl, $_SESSION['action']->callback());
			$alg = new Algorithm();
			$arr = $alg->render($repo->getAllCommits(), 0, $width, $height, 'callback');
			$_SESSION['image'] = $arr;
			$start = strrpos($repourl, '/');
			$_SESSION['title'] = substr($repourl, $start+1, strrpos($repourl, '.')-$start-1);
			unsetAll();
			header('Location: ../image.php');
			exit(0);
		} catch (Exception $e) {
			unsetAll();
			$_SESSION['error_message'] = $e->getMessage();
			header('Location: ../index.php');
			exit(1);
		}
	}

	/**
	 * Unsets session variables: error_message, current_progress, loading, loading_info
	 */
	function unsetAll() {
		unset($_SESSION['error_message']);
		unset($_SESSION['current_progress']);
		unset($_SESSION['loading']);
		unset($_SESSION['loading_info']);
	}
	
?>
