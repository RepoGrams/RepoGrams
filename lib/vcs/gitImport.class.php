<?php
error_reporting(-1);

class gitImport {

	public function __construct($repo,$user=null,$password=null){
		$tmp = tempnam(sys_get_temp_dir(),"");
		unlink($tmp);
		mkdir($tmp);
		$tmp;			
		if (!file_exists($tmp)) throw new Exception("Temporary folder could not be created!");
		$command = 	'cd '.$tmp;
		$command.=	' && git clone '.$repo;
		$command."\n";
		shell_exec($command);
		// if (!file_exists($tmp.'/.git')) throw new Exception ('No .git Folder found');
		$command = 'cd '.$tmp."/*/ && git log --pretty='%x1A%H%x1A:{%x1Aauthor%x1A:%x1A%an%x1A,%x1Aauthor_mail%x1A:%x1A%ae%x1A,%x1Adate%x1A:%x1A%at%x1A,%x1Amessage%x1A:%x1A%s%x1A},'";
		$output = shell_exec($command);
		//echo $output;
		$json = self::unescape($output,chr(26));
		echo $json;
		$json = substr($json,0,strlen($json)-2);
		$json = '{'.$json.'}';
		
		$json = utf8_encode($json);
		$output_array = json_decode($json);
		print_r($output_array);
	}



	private function unescape($escapedString, $escapeCharacter) {
        	// Replace " with the escape sequence for JSON
	        $intermediate = preg_replace('/"/', '\"', $escapedString);
        	// Replace escapeCharacter with "
	        return preg_replace('/'.$escapeCharacter.'/', '"', $intermediate);
	}	

}
/*
// echo "Executing: '".$command."'\n";
$output = shell_exec($command);
//$output = str_replace("\n",'',$output);


$test = array();
$test['hans'] = array();
$test['hans']['peter']="Klemmelemmeling";
$test['werner'] = "olm";
$test['hans']['werner']="auch 'Olm'";
//print_r($test);
$test2 = json_encode($test);

echo "\n\n".$test2."\n\n";
//print_r(json_decode($test2));
?>*/
?>

