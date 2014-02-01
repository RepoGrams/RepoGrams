<?php
/*
 *  On PHP 5.4.0 and higher, only start the session if it is not already started
 *  On former versions, suppress the warning about it being already started,
 *  as there is no reliable check of the session status in this versions
 */
function startSessionIfNotStarted() {
  if (version_compare(phpversion(), '5.4.0', '<')) {
    // php version isn't high enough
    @session_start();
  } else {
    if (session_status() === PHP_SESSION_NONE) session_start();
  }
}
?>
