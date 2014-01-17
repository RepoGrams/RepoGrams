<?php
require_once __DIR__.'/../RepoImporter.class.php';


error_reporting(-1);

class gitImport extends RepoImporter {
	private $RepoObject;

	public function __construct($repo, $start, $end, &$datadir=NULL) { //,$user=null,$password=null){
		if(!is_null($datadir) && !file_exists($datadir)){
			throw new Exception("given cache-directory does not exist");
			return 0;
		}
		
		error_log("start: ".$start." end: ".$end);
		if (($this->is_valid_url($repo) === false)){
			// die("<h1>Possible injection detected</h1>");
			error_log("Injection detected: $repo");
			throw new Exception("Invalid URL!");	
			return 0;
		}	
		
		if(is_null($datadir)){
			$tmp = tempnam(sys_get_temp_dir(),"");
			unlink($tmp);
			mkdir($tmp);
			if (!file_exists($tmp)) throw new Exception("Temporary folder could not be created!");
			chdir($tmp);
			$command = 'git clone --bare "'.$repo.'"';
		} else {
			chdir($datadir);
			$command = 'git pull';
		}
                		
		$command."\n";
		error_log($command);
		shell_exec($command);
                $split = explode("/", $repo); //http://stackoverflow.com/questions/2967597/only-variables-can-be-passed-by-reference
                $gitdir = end($split); // the last part of the git URL is the folder name
                $joint = getcwd()."/".$gitdir."/";
                error_log("joint: ".$joint);
                if (!file_exists($joint)) throw new Exception ('Fetching git-Repository was not sucessfull (Invalid URL?)');
		
		if (is_null($datadir)) $datadir = $joint; // set $datadir for cache
		
		chdir($joint);
                
		$since = "";
                $before= "";
                if (!is_null($start) && $start !== "") {
                  $since= "--since ".$start." ";
                } 
                if (!is_null($end) && $end !== "") {
                  $before = "--before ".$end." ";
                }
                $separator = chr(26);
		$command = "git log ".$since.$before."--numstat --pretty='".$separator."},".$separator."%H".$separator.":{".$separator."author".$separator.":".$separator."%an".$separator.",".$separator."author_mail".$separator.":".$separator."%ae".$separator.",".$separator."date".$separator.":".$separator."%at".$separator.",".$separator."message".$separator.":".$separator."%s".$separator.",".$separator."changes".$separator." : ".$separator."'";
                error_log($command);
		$output = shell_exec($command);
                chdir($cwd);
		$json = self::unescape($output,$separator);
		$json = substr($json,3,strlen($json));
		$json = '{'.$json.'"}}';
		
		$output_array = json_decode($json,true);
                if (is_null($output_array)) {
                  $json = utf8_encode($json);
                  $output_array = json_decode($json,true);
                }
		if (is_null($output_array)) {
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

