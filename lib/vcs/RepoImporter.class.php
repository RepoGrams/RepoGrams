<?php

class RepoImporter {
  protected function unescape($escapedString, $escapeCharacter) {
    // Replace bad characters with the corresponding escape sequence for JSON
    $badCharacters = array('!\\\\!','!"!', '!/!' ,'!\\f!','!\\n!','!\\r!','!\\t!'); // Not supported: backspace, utf8-characters
    $correspondingGoodCharacters = array('\\\\\\\\','\\\\"','\\\\/' ,'\\\\f','\\\\n','\\\\r','\\\\t');
    $intermediate = preg_replace($badCharacters, $correspondingGoodCharacters, $escapedString);
    // Replace escapeCharacter with "
    return preg_replace('/'.$escapeCharacter.'/', '"', $intermediate);
  }

  /*
   *  Check if reliably working timeout functionality is avaiable,
   *  and modify a command string to actually timeout in that case
   *  @$command: a command string which has to be executed later via shell_exec 
   *             or similiar functions 
   *  @return: true, if functionality is available, else false
   */
  protected function prepareCommandTimeOut(&$command) {
    $output = shell_exec("timeout 10 echo works");
    if ($output !== "works\n") {
      return false;
    } else {
      if (defined('_TIMEOUT')) {
        $timeout = _TIMEOUT;
      } else {
        error_log("Please set the _TIMEOUT constant! Using 3 minutes for now.");
        $timeout =  180;
      }
      $command = "timeout ".$timeout." ".$command; // let command timeout
      return true;
    }
  }
  
}

?>
