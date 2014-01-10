<?php
require_once __DIR__."/../vcs/RepoFactory.class.php";

/* A LRU cache for repositories */
class Cache {
        // TODO: no need to store the keys twice
        private $repoURL2frequency;
        private $repoURL2dataFolder;

        // currently $cache_size is the number of entries
        // we might want to change this to MB
        private $cache_size;
        private $fill_size;

        public function __construct($size) {
          $this->repo2frequency = array();
          $this->cache_size = $size;
          $this->fill_size = 0;
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
            // the element is in the cache, return it
            $repoURL2frequency[$repoURL] = $repo2frequency[$repoURL] + 1;
            $datadir = $repoURL2dataFolder[$repoURL];
            return new GitRepo($url, $start, $end, $datadir);
          } else {
            // the element is not in the cache so let's construct it
            $datadir = NULL;
            $repo = new GitRepo($url, $start, $end, $datadir);
            // update the cache
            if ($this->fill_size < $this->cache_size) {
              // we have still free space in the cache
              $this->repoURL2frequency[$url] = 1;
              $this->repoURL2dataFolder[$url] = $datadir;
              $this->fill_size++;
            } else {
              // no free space in the array anymore
              // decrement frequency of all elements in cache
              foreach($repo2frequency as $key => &$value) {
                $value--;
              }
              // get the key(s) with the minimal value
              $minimalKeys = array_keys($repo2frequency, min($repo2frequency));
              $minimalKeys = $minimalKey[0];
              if ($repo2frequency[$minimalKey] <= 0) {
                // evict the cache entry
                unset($repo2frequency[$minimalKey]);
                // TODO
                // delete the directory of the evicted repository
                // $folder = $repoURL2dataFolder[$min];
                unset($repoURL2dataFolder[$minimalKey]);

                // add the new 
                $this->repoURL2frequency[$url] = 1;
                $this->repoURL2dataFolder[$url] = $datadir;
              }
            }
            return $repo;
          }
        }
}

?>
