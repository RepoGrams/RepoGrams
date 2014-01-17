<?php
require_once "git/GitRepo.class.php";
require_once __DIR__."/../../php/action.php";
require_once __DIR__."/../cache/Cache.class.php";

class RepoFactory {
	static function createRepo($url, $start, $end) {
		error_log('Hi. I am the RepoFactory.');
		callback('Accessing repository....');
		$cache = new Cache(42);
		return $cache->get($url, $start, $end);
	}
}

?>
