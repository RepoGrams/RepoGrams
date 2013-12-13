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
  
}

?>
