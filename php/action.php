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
	if (checkInput($_SESSION['repourl'])) {
          renderRepo($_SESSION['repourl']);
        }
	
	/**
	 * Check formular input if url is empty
         * @returns: true iff the url is valid
	 */
	function checkInput($repourl = null) {
          if (   strpos($repourl, "http") === false
              || !str_replace(' ','',$repourl) != '') {
                error_log("Illegal input");
                $_SESSION['error_message'] = msg('Invalid repository url.');
                $retVal = array("error"=>true, "finished" => false);
                header('Content-Type: application/json');
                echo(json_encode($retVal));
                return false;
          }
          return true;
	}
	
	/**
	 * Renders the repository with the provided $repourl and displays the image on image.php
	 * Session-Variables: image, title, error_message, 
	 */
	function renderRepo($repourl = null) {
          error_log("========================>");
          error_log($_POST['state']);
		try {
			switch  ($_POST['state']) {
				case 0:
					$_SESSION['repo'] = serialize(RepoFactory::createRepo($repourl,$_SESSION['start'], $_SESSION['end'])->getAllCommits());
					error_log(gettype($_SESSION['repo']));
					error_log("Repo created");
                                        header('Content-Type: application/json');
                                        $retval = array("error" => false, "finished" => false);
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
                                        header('Content-Type: application/json');
                                        $retval = array("error" => false, "finished" => true);
                                        echo(json_encode($retval));
					return;
			}
		} catch (Exception $e) {
			$_SESSION['error_message'] = $e->getMessage();
		}
	}
?>
