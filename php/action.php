<?php
	session_start();
	
	require_once(__DIR__."/../lib/vcs/RepoFactory.class.php");
	require_once("algorithm.php");
	
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
	initVariables();
	$url = $_POST['projectlink'];
	if (checkInput($url)) renderRepo($url);
	
	
	/**
	 * Initialize session variables
	 */
	function initVariables() {
		$_SESSION['current_progress'] = 0;
		$_SESSION['loading_info']     = 'Loading...';
		$_SESSION['loading']          = false;     
		$_SESSION['error_message']    = '';     
		$_SESSION['title']            = ''; 
		$_SESSION['action']           = new action();
		
		$width  = 768;                                   
		$height = 512;                                 
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
		} catch (Exception $e) {
			unsetAll();
			$_SESSION['error_message'] = $e->getMessage();
			header('Location: ../index.php');
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
