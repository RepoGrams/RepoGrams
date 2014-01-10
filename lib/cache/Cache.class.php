<?php
require_once __DIR__."/../vcs/RepoFactory.class.php";

/* A LRU cache for repositories */
class Cache {
        // TODO: no need to store the keys twice
        private $repoURL2frequency;
        private $repoURL2dataFolder;

        public function __construct() {
          $repo2frequency = array();
          // Read the serialized value of $repo2frequency
        }

        public function __destruct() {
          // Store the serialized value of $repo2frequency
        }

        /*
         *  This method will return the repository corresponding to the URL
         *  If it is already in the cache, it will return the cached value
         *  else it will retrieve the required data and cache it if there is 
         *  still space in the cache.
         *  @repoURL: the name of the repository that we want to retrieve
         *  @returns: the corresponding Repo object
         */
        public function get($repoURL, $start, $end) {
          if (array_key_exists($repoURL, $repo2frequency)) {
            // the element is in the cache
            $repoURL2frequency[$repoURL] = $repo2frequency[$repoURL] + 1;
            $datadir = $repoURL2dataFolder[$repoURL];
            return new GitRepo($url, $start, $end, $datadir);
          } else {
            // the element is not in the cache and we return NULL
            $datadir = NULL;
            $repo = new GitRepo($url, $start, $end, $datadir);
            return $repo;
          }
        }
}

?>
