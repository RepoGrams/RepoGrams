<?php

	/*
	 * Check formular input
	 */
	if(isset($_POST['projectlink']) && str_replace(' ','',$_POST['projectlink']) != '') {
		$url = $_POST['projectlink'];
	} else {
		$error=true;
		header('Location: ../render.php?error=true');
	}
	
	if(isset($_POST['history']) && $_POST['history'] == 'true') {
		$history = $_POST['history'];
	}

	/*
	 * TODO: Connect to git/..., ask for password/username if required etc.
	 */
	
?>
