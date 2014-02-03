<?php
require_once __DIR__.'/../RepoImporter.class.php';

error_reporting(-1);
if (function_exists('mb_internal_encoding')) {
  error_log("using utf8!");
  mb_internal_encoding( 'UTF-8' );
}

class gitImport extends RepoImporter {
	private $RepoObject;

	public function __construct($repo, $start, $end, &$datadir=NULL) { //,$user=null,$password=null){
		if(!is_null($datadir) && !file_exists($datadir)){
			error_log("given cache-directory does not exist");
			$datadir = NULL;
		}
		
		error_log("start: ".$start." end: ".$end);
		if (($this->is_valid_url($repo) === false)){
			// die("<h1>Possible injection detected</h1>");
			error_log("Injection detected: $repo");
			throw new Exception("Invalid URL!");	
			return 0;
		}	
                $exitcode = 0;
                $output = array();
                $command = "";
                self::prepareCommandTimeOut($command); // let command timeout
		if(is_null($datadir)){
			$tmp = tempnam(sys_get_temp_dir(),"");
			unlink($tmp);
			mkdir($tmp);
			if (!file_exists($tmp)) throw new Exception("Temporary folder could not be created!");
			chdir($tmp);
			$command .= 'git clone --mirror "'.$repo.'"';
                        $command."\n";
                        error_log($command);
                        exec($command, $output, $exitcode);
                        if ($exitcode === 124) {
                          throw new Exception("Connection timed out. The repository was too large or the connection to the server dropped");
                        }
		} else {
			chdir($datadir);
                        error_log(">> the datadir before fetching: ". $datadir);
                        $command .= 'git fetch --all';
                        $command."\n";
                        error_log($command);
                        exec($command, $output, $exitcode);
                        if ($exitcode === 124) {
                          throw new Exception("Connection timed out. The repository was too large or the connection to the server dropped.");
                        }
                        chdir("..");// hacked. as $datadir contains the git-working directory and we want the tmp-root-directory  
		}
                		
                $repo = rtrim($repo, '/');
                $split = explode("/", $repo); //http://stackoverflow.com/questions/2967597/only-variables-can-be-passed-by-reference
                $gitdir = end($split); // the last part of the git URL is the folder name
                error_log($gitdir);
                $joint = getcwd()."/".$gitdir."/";
                error_log("joint: ".$joint);
                if (!file_exists($joint)) {
                  $joint = rtrim($joint, '/');
                  $joint = $joint.".git";
                  if (!file_exists($joint)) {
                    error_log("joint: ".$joint);
                    throw new Exception ('Fetching git-Repository was not sucessfull (Invalid URL?)');
                  }
                }
                error_log("joint exists");
		
		if (is_null($datadir)) $datadir = $joint; // set $datadir for cache
		
		chdir($joint);
                
		$since = "";
                $before= "";
                $separator = utf8_encode(chr(26));
		$command = "git log ".$since.$before."--numstat --pretty='".$separator."},".$separator."%H".$separator.":{".$separator."author".$separator.":".$separator."%an".$separator.",".$separator."author_mail".$separator.":".$separator."%ae".$separator.",".$separator."date".$separator.":".$separator."%at".$separator.",".$separator."message".$separator.":".$separator."%s".$separator.",".$separator."changes".$separator." : ".$separator."'";
                error_log($command);
		$output = shell_exec($command);
		$json = self::unescape($output,$separator);
		$json = substr($json,3,strlen($json));
		$json = '{'.$json.'"}}';
		
		$output_array = json_decode($json,true);
                if (is_null($output_array)) {
                  // hit string with sledgehammer until it is Unicode
                  // this implies so much failure:
                  // git --log doesn't return real unicode (e.g. for git.git)
                  // but some gibberish character
                  // in theory mb_convert_encoding UTF-8 to UTF-8 should fix this
                  // in practice it doesn't; so we apply he regex from [1]
                  // however, even after this, some weird \x1b character is left 
                  // over, so we replace every occurence of it 
                  // [1] http://stackoverflow.com/questions/1401317/remove-non-utf8-characters-from-string
                  if (function_exists('mb_convert_encoding')) {
                    error_log("Using mb_convert_encoding");
                    mb_substitute_character(0xFFFD);
                    $json = mb_convert_encoding($json, 'UTF-8', 'UTF-8');
                  } else {
                    error_log("No mb functionality?????");
                    $json = utf8_encode($json);
                  }
                  $output_array = json_decode($json,true);
                  if (is_null($output_array)) {
                    ini_set('pcre.backtrack_limit', 99999999999);
                    $json= preg_replace('/[\x00-\x08\x10\x0B\x0C\x0E-\x19\x7F]'.
                      '|[\x00-\x7F][\x80-\xBF]+'.
                      '|([\xC0\xC1]|[\xF0-\xFF])[\x80-\xBF]*'.
                      '|[\xC2-\xDF]((?![\x80-\xBF])|[\x80-\xBF]{2,})'.
                      '|[\xE0-\xEF](([\x80-\xBF](?![\x80-\xBF]))|(?![\x80-\xBF]{2})|[\x80-\xBF]{3,})/S',
                      '?', $json);
                    
                    //reject overly long 3 byte sequences and UTF-16 surrogates and replace with ?
                    $json = preg_replace('/\xE0[\x80-\x9F][\x80-\xBF]'.
                      '|\xED[\xA0-\xBF][\x80-\xBF]/S','?', $json );
                    $output_array = json_decode($json,true);
                    if (is_null($output_array)) {
                      $json = preg_replace("/\x1b/", "", $json);
                      $output_array = json_decode($json,true);
                    }
                  }
                }
		if (is_null($output_array)) {
                        file_put_contents("/tmp/test2.txt", $json);
			error_log("stop");
		}
		$this->RepoObject = $output_array;
		//self::removeDir($tmp);
	}

	
  
  /* Verify the syntax of the given URL.
  *
  * @access public
  * @param $url The URL to verify.
  * @return boolean
  */
private function is_valid_url($url) {
   if ($this->str_starts_with(strtolower($url), 'http://localhost')) {
     return true;
   }
   return preg_match('/^(https?):\/\/'.                                         // protocol
'(([a-z0-9$_\.\+!\*\'\(\),;\?&=-]|%[0-9a-f]{2})+'.         // username
'(:([a-z0-9$_\.\+!\*\'\(\),;\?&=-]|%[0-9a-f]{2})+)?'.      // password
'@)?(?#'.                                                  // auth requires @
')((([a-z0-9]\.|[a-z0-9][a-z0-9-]*[a-z0-9]\.)*'.           // domain segments AND
'[a-z][a-z0-9-]*[a-z0-9]'.                                 // top level domain  OR
'|((\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.){3}'.
'(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])'.                 // IP address
')(:\d+)?'.                                                // port
')(((\/+([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)*'. // path
'(\?([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)'.      // query string
'?)?)?'.                                                   // path and query string optional
'(#([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)?'.      // fragment
'$/i', $url);
}


/**
  * String starts with something
  *
  * This function will return true only if input string starts with
  * niddle
  *
  * @param string $string Input string
  * @param string $niddle Needle string
  * @return boolean
  */
function str_starts_with($string, $niddle) {
       return substr($string, 0, strlen($niddle)) == $niddle;
}
	
	public function getRawRepoInfo(){
		if (isset($this->RepoObject) && !is_null($this->RepoObject))
			return $this->RepoObject;
		else
			throw new Exception("Fetching GitObject was not sucessfull");
	}
	
	private function removeDir($path){
		$files = array_diff(scandir($path), array('.','..'));
		foreach ($files as $file) {
		 (is_dir("$path/$file")) ? self::removeDir("$path/$file") : unlink("$path/$file");
		}
		return rmdir($path);
	}
}
?>

