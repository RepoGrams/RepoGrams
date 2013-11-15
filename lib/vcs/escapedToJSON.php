<?php

function unescape($escapedString, $escapeCharacter) {
        // Replace " with the escape sequence for JSON
        $intermediate = preg_replace('"', '\"', $escapedString);
        // Replace escapeCharacter with "
        return preg_replace($escapeCharacter, '"', $intermediate);
}

?>
