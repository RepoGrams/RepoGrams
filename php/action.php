<?php
require_once('./php/utils.php');
startSessionIfNotStarted();
error_reporting(-1);
	require_once(__DIR__."/../lib/vcs/RepoFactory.class.php");
	require_once(__DIR__."/algorithm.php");
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
         *  signals that an error has occured
         *  by echo'ing the corresponding JSON
         *  the error message will be written in the
         *  'error_message' session variable
         *  @msg: the error message
         */
        function reportError($msg) {
          error_log("reporting error");
          error_log($msg);
          $retVal = array("error"=>true, "finished" => false);
          header('Content-Type: application/json');
          $_SESSION['error_message'] = $msg;
          echo(json_encode($retVal));
        }

	/**
	 * Check formular input if url is empty
         * @returns: true iff the url is valid
	 */
	function checkInput($repourl = null) {
          if (   strpos($repourl, "http") === false
              || !str_replace(' ','',$repourl) != '') {
                error_log("Illegal input");
                /* TODO: localization currently does not work */
                reportError(msg('bug-inv'));
                return false;
          }
          return true;
	}
	
	/**
	 * Renders the repository with the provided $repourl and displays the image on image.php
	 * Session-Variables: image, title, error_message, 
	 */
	function renderRepo($repourl = null) {
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
					$_SESSION['image'] = $alg->render($ses,0,$_SESSION['width'], $_SESSION['height']);
					error_log("Image created");
					$start = strrpos($repourl, '/');
					$_SESSION['title'] = substr($repourl, $start+1, strrpos($repourl, '.')-$start-1);
                                        header('Content-Type: application/json');
                                        $retval = array("error" => false, "finished" => true);
                                        echo(json_encode($retval));
					return;
			}
		} catch (Exception $e) {
                        reportError($e->getMessage());
		}
	}
?>
