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
          $this->cache_size = $size;
          $this->fill_size = 0;
	  error_log("Hi, Constructor of Cache speaking...");
	  if (isset($_SESSION['repoURL2frequency']) && (isset($_SESSION['repoURL2dataFolder'])) ){
		$this->repoURL2frequency = unserialize($_SESSION['repoURL2frequency']);
		$this->repoURL2dataFolder =  unserialize($_SESSION['repoURL2dataFolder']);
	  } else {
		$this->repoURL2frequency = array();	
		$this->repoURL2dataFolder = array();
		
	  }
        }

        public function __destruct() {
        	$_SESSION['repoURL2frequency'] = serialize($this->repoURL2frequency);
		$_SESSION['repoURL2dataFolder'] = serialize($this->repoURL2dataFolder);

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
          if (array_key_exists($repoURL, $this->repoURL2frequency)) {
            // the element is in the cache, return it
            error_log("key exists!");
	    $this->repoURL2frequency[$repoURL] = $this->repoURL2frequency[$repoURL] + 1;
            $datadir = $this->repoURL2dataFolder[$repoURL];
            error_log("Cache says datadir is: ".$datadir);
	    return new GitRepo($repoURL, $start, $end, $datadir);
          } else {
	    error_log("key doesnt exist");
            // the element is not in the cache so let's construct it
            $datadir = NULL;
            $repo = new GitRepo($repoURL, $start, $end, $datadir);
            error_log('I got '.$datadir);
	    // update the cache
            if ($this->fill_size < $this->cache_size) {
              // we have still free space in the cache
              $this->repoURL2frequency[$repoURL] = 1;
              $this->repoURL2dataFolder[$repoURL] = $datadir;
              $this->fill_size++;
            } else {
              // no free space in the array anymore
              // decrement frequency of all elements in cache
              foreach($this->repo2frequency as $key => &$value) {
                $value--;
              }
              // get the key(s) with the minimal value
              $minimalKeys = array_keys($this->repoURL2frequency, min($this->repoURL2frequency));
              $minimalKeys = $minimalKey[0];
              if ($this->repoURL2frequency[$minimalKey] <= 0) {
                // evict the cache entry
                unset($this->repoURL2frequency[$minimalKey]);
                // TODO
                // delete the directory of the evicted repository
                // $folder = $repoURL2dataFolder[$min];
                unset($this->repoURL2dataFolder[$minimalKey]);

                // add the new 
                $this->repoURL2frequency[$repoURL] = 1;
                $this->repoURL2dataFolder[$repoURL] = $datadir;
              }
            }
            return $repo;
          }
        }
}

?>
