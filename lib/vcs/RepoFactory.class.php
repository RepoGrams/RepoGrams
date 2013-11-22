<?php
require_once "git/GitRepo.class.php";
require_once __DIR__."/../../php/action.php";

class RepoFactory {
	static function createRepo($url, $callback) {
		$act = new action();
		call_user_func('callback', "test");
		return new GitRepo($url);
	}
}

?>
