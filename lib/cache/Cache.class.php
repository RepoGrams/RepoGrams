<?php
require_once __DIR__."/../vcs/RepoFactory.class.php";
require_once __DIR__."/../../config.inc.php";

/* A LRU cache for repositories */
class Cache {
        // TODO: no need to store the keys twice
        private $repoURL2frequency;
        private $repoURL2dataFolder;

        // currently $cache_size is the number of entries
        // we might want to change this to MB
        private $cache_size;
        private $fill_size;
        private $dbconnection;
        private $dbalive;

        public function __construct($size) {
          $this->cache_size = $size;
          $this->dbconnection = new mysqli(_MYSQLSERVER,_MYSQLUSER,_MYSQLPASSWORD,_MYSQLDB);
          $query = 'SELECT (*) FROM url2data;';
          if ($this->dbconnection->connect_errno) {
            error_log("Connecting to database failed!");
            $this->dbalive = false;
          } else {
            $this->dbalive = true;
          }
	  error_log("Hi, Constructor of Cache speaking...");
          
        }

        public function __destruct() {
        	$_SESSION['repoURL2frequency'] = serialize($this->repoURL2frequency);
		$_SESSION['repoURL2dataFolder'] = serialize($this->repoURL2dataFolder);

		// Store the serialized value of $repoURL2frequency
        }


        /* 
         * $url: the URL of the repo
         * returns an array [frequency, foldername]
         */
        private function getInfo($url) {
          $query = sprintf("SELECT folder, frequency 
            FROM url2data WHERE url = '%s'",
            mysqli::real_escape_string($url)
          );
          error_log("getInfo query: ". $query);
          $result = $this->dbconnection->query($query);
          if ($result) {
            $row = $result->fetch_object();
            $result->close();
            if ($row) {
              return $row;
            } else {
              return false;
            }
          } else {
            // url not in database
            error_log("entry was not found");
            return false;
          }
        }


        /* 
         * $url: the URL of the repo
         * stores $url and the $path2folder
         */
        private function storeInfo($url, $path2folder) {
          $query = sprintf("INSERT INTO url2data (url, frequency, folder)
                            VALUES ('%s', 1, '%s')",
            mysqli::real_escape_string($url),
            mysqli::real_escape_string($path2folder)
          );
          error_log($query);
          $result = $this->dbconnection->query($query);
          // result must be true, else it would indicate that
          // inserting had failed
          assert($result === true);
        }

        /*
         *  increments the frequency for $url
         */
        private function atomicIncrementFrequencyForURL($url) {
          $query = sprintf(
            "UPDATE url2data 
             SET frequency  = frequency + 1
             WHERE url = '%s'
            ", mysqli::real_escape_string($url));
          $result = $this->dbconnection->query($query);
          assert($result);
        }

        private function atomicDecrementFrequency() {
          $query = sprintf(
            "UPDATE url2data 
             SET frequency  = frequency - 1;
            "
          );
          $result = $this->dbconnection->query($query);
          assert($result);
        }

        private function getFillSize() {
          $query = sprintf(
            "SELECT COUNT(*) as fillsize FROM url2data;"
          );
          $result = $this->dbconnection->query($query);
          assert($result);
          $retval = $result->fetch_object()->fillsize;
          $result->close();
          return $retval;
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
          if ($this->dbalive !== true) {
	    return new GitRepo($repoURL, $start, $end, $datadir);
          }
          $result = $this->getInfo($repoURL);
          assert($result !== null);
          if ($result !== false) {
            // the element is in the cache, return it
            error_log("key exists!");
            $this->atomicIncrementFrequencyForURL($repoURL);
            $datadir = $result->folder;
            error_log("Cache says datadir is: ".$datadir);
            $repo = new GitRepo($repoURL, $start, $end, $datadir);
            if ($datadir !== $result->folder) {
              /* The directory was cached,
               * but the folder containing the data has been deleted.
               * In this case we just update the location of the cache folder
               */
              $query = sprintf(
                "UPDATE url2data
                 SET folder = '%s'
                 WHERE url = '%s'",
                 $datadir, $repoURL
               );
              $result = $this->dbconnection->query($query);
              assert($result);
            }
            return $repo;
          } else {
	    error_log("key doesnt exist");
            // the element is not in the cache so let's construct it
            $datadir = NULL;
            $repo = new GitRepo($repoURL, $start, $end, $datadir);
            error_log('I got '.$datadir);
            error_log("fill size: ". $this->getFillSize());
	    // update the cache
            if ($this->getFillSize() < $this->cache_size) {
              // we have still free space in the cache
              $this->storeInfo($repoURL, $datadir);
            } else {
              // no free space in the array anymore
              // decrement frequency of all elements in cache
              $this->atomicDecrementFrequency();
              // get the key(s) with the minimal value
              // query returns
              $query = "SELECT id, frequency 
                FROM url2data
                ORDER BY frequency
                LIMIT 1;";
              // result is [minimal_frequency, id]
              $result = $this->dbconnection->query($query);
              $min2id = $result->fetch_object();
              $result->close();
              if ($min2id->frequency <= 0) {
                // evict the cache entry
                error_log("evicting cache entry");
                $query = sprintf(
                      "DELETE FROM url2data
                      WHERE id = '%s'",
                      mysqli::real_escape_string($min2id->id)
                );
                $result = $this->dbconnection->query($query);
                assert($result);
                // TODO
                // delete the directory of the evicted repository
                $this->storeInfo($repoURL, $datadir);
              }
            }
            return $repo;
          }
        }
}
?>
