<?php
require_once "git/GitRepo.class.php";

class RepoFactory {
	static function createRepo($url, $callback) {
		return new GitRepo($url);
	}
}

?>
