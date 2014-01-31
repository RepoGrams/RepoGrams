<?php
// short snippet to destroy the set session variables when the user presses the
// abort button on the loading.php site
$_SESSION= array();
//session_destroy();
header ('Location:../index.php');
?>
