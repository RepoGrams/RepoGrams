<?php
require_once "git/GitRepo.class.php";
require_once "../../php/action.php";

class RepoFactory {
	static function createRepo($url, $callback) {
		$act = new action();
		$act->$callback("test");
		return new GitRepo($url);
	}
}

?>
