<?php
require_once "svn/SvnRepo.class.php";
require_once "git/GitRepo.class.php";
require_once __DIR__."/../../php/action.php";
require_once __DIR__."/../cache/Cache.class.php";

class RepoFactory {
	static function createRepo($url, $start, $end) {
		error_log('Hi. I am the RepoFactory.');
                if (defined('_USECACHE') && _USECACHE === true) {
                  $cache = new Cache(42);
                  return $cache->get($url, $start, $end);
                } else {
                  return $this->makeRepo($url, $start, $end, null);
                }
	}

        static function makeRepo($url, $start, $end, &$datadir) {
            // check if repository is git repo
            $command = "git ls-remote ".$url;
            $exitcode = 0;
            $output = array();
            exec($command, $output, $exitcode);
            if ($exitcode === 0) {
              return new GitRepo($url, $start, $end, $datadir);
            } else {
              $command = "svn ls ".$url." --depth empty";
              exec($command, $output, $exitcode);
              if ($exitcode === 0) {
                return new SvnRepo($url, $start, $end, $datadir);
              }
              throw new Exception("URL does not point to a repository!");
            }
        }
}

?>
