<?php
	session_start();
	require_once(__DIR__."/../lib/vcs/RepoFactory.class.php");
	require_once("newAlgorithm.php");
	require_once("functions.php");
	require_once("language.php");
	require_once(__DIR__."/../lib/vcs/git/GitRepo.class.php");

	/**
	 * Check the formular input and start rendering
	 */
	checkInput($_SESSION['repourl']);
	renderRepo($_SESSION['repourl']);
	
	/**
	 * Check formular input if url is empty
	 */
	function checkInput($repourl = null) {
          if (strpos($repourl, "http") === false) {
			$_SESSION['error_message'] = msg('Invalid repository url.');
			$_SESSION['error'] = true;
			$retVal = array("error"=>true);
			echo(json_encode($retVal));
			return;
          }
		if(!str_replace(' ','',$repourl) != '') {
			$_SESSION['error_message'] = msg('Invalid repository url.');
			$_SESSION['error'] = true;
			$retVal = array("error"=>true);
			echo(json_encode($retVal));
			return;
		}
	}
	
	/**
	 * Renders the repository with the provided $repourl and displays the image on image.php
	 * Session-Variables: image, title, error_message, 
	 */
	function renderRepo($repourl = null) {
		error_log($_SESSION['STATE']);
		try {
			switch  ($_SESSION['STATE']) {
				case 0:
					$_SESSION['repo'] = serialize(RepoFactory::createRepo($repourl,$_SESSION['start'], $_SESSION['end'])->getAllCommits());
					error_log(gettype($_SESSION['repo']));
					error_log("Repo created");
					$_SESSION['STATE']=1;
                                        header('Content-Type: application/json');
                                        $retval = array("finished" => false);
                                        echo(json_encode($retval));
					return;
				case 1:
					$alg = new Algorithm();
					error_log(gettype($_SESSION['repo']));
                    $ses = unserialize($_SESSION['repo']);
					$_SESSION['image'] = $alg->render($ses,0,0,$_SESSION['width'], $_SESSION['height']);
					error_log("Image created");
					$start = strrpos($repourl, '/');
					$_SESSION['title'] = substr($repourl, $start+1, strrpos($repourl, '.')-$start-1);
					unsetAll();
					$_SESSION['finish'] = true;
					$_SESSION['state']=0;
                                        header('Content-Type: application/json');
                                        $retval = array("finished" => true);
                                        echo(json_encode($retval));
					return;
			}
		} catch (Exception $e) {
			unsetAll();
			$_SESSION['error'] = true;
			$_SESSION['error_message'] = $e->getMessage();
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
