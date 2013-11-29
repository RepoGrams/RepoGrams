<?php
require_once "git/GitRepo.class.php";
require_once __DIR__."/../../php/action.php";

class RepoFactory {
	static function createRepo($url) {
		call_user_func(array('callback', 'call','aCCESSING REPO....'));
		return new GitRepo($url);
	}
}

?>
