<?php
error_reporting(-1);

class gitImport {
	private $RepoObject;

	public function __construct($repo,$user=null,$password=null){
		if ($this->validateURL($repo) === false){
		die("<h1>Possible injection detected</h1>");
		}	
		$tmp = tempnam(sys_get_temp_dir(),"");
		unlink($tmp);
		mkdir($tmp);
		$tmp;			
		if (!file_exists($tmp)) throw new Exception("Temporary folder could not be created!");
		$command = 	'cd '.$tmp;
		$command.=	' && git clone "'.$repo.'"';
		$command."\n";
		shell_exec($command);
		// if (!file_exists($tmp.'/.git')) throw new Exception ('No .git Folder found');
		$command = 'cd '.$tmp."/*/ && git log --numstat --pretty='%x1A},%x1A%H%x1A:{%x1Aauthor%x1A:%x1A%an%x1A,%x1Aauthor_mail%x1A:%x1A%ae%x1A,%x1Adate%x1A:%x1A%at%x1A,%x1Amessage%x1A:%x1A%s%x1A,%x1Achanges%x1A : %x1A'";
		$output = shell_exec($command);
		//echo $output;
		$json = self::unescape($output,chr(26));
		$json = substr($json,3,strlen($json));
		$json = '{'.$json.'"}}';
		
		$json = utf8_encode($json);
		$output_array = json_decode($json,true);
		//	print_r($output_array);
		$this->RepoObject = $output_array;
		self::removeDir($tmp);
	}

	private function validateURL($URL) {
		$pattern_1 = "/^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+.(com|de|org|net|edu|dk|at|us|tv|info|uk|co.uk|biz|se)$)(:(\d+))?\/?/i";
      		$pattern_2 = "/^(www)((\.[A-Z0-9][A-Z0-9_-]*)+.(com|org|net|dk|at|us|tv|info|uk|co.uk|biz|se|edu|de)$)(:(\d+))?\/?/i";       
      		if(preg_match($pattern_1, $URL) || preg_match($pattern_2, $URL)){
		        return true;
	      	} else {
	        	return false;
      		}
    	}

	public function getRawRepoInfo(){
		if (isset($this->RepoObject) && !is_null($this->RepoObject))
			return $this->RepoObject;
		else
			throw new Exception("Fetching GitObject was not sucessfull");
	}
	
	private function unescape($escapedString, $escapeCharacter) {
        	// Replace bad characters with the corresponding escape sequence for JSON
		$badCharacters = array('/"/','/\//' ,'/\\\/','/\f/','/\n/','/\r/','/\t/'); // Not supported: backslash, utf8-characters
		$correspondingGoodCharacters = array('\"','\/' ,'\\','\f','\n','\r','\t');
	        $intermediate = preg_replace($badCharacters, $correspondingGoodCharacters, $escapedString);
	       	// Replace escapeCharacter with "
	        return preg_replace('/'.$escapeCharacter.'/', '"', $intermediate);
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

