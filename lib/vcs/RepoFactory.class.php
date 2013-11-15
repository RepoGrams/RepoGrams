<?php
require_once "git/GitRepo.class.php";

class RepoFactory {
	function createRepo($url) {
		return new GitRepo($url);
	}
}

?>
