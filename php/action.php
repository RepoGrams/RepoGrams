<?php

	/*
	 * Check formular input
	 */
	if(isset($_POST['projectlink']) && str_replace(' ','',$_POST['projectlink']) != '') {
		$url = $_POST['projectlink'];
	} else {
		echo 'Please enter a valid project url';
	}
	
	if(isset($_POST['history']) && $_POST['history'] == 'true') {
		$history = $_POST['history'];
	}

	/*
	 * TODO: Connect to git/..., ask for password/username if required etc.
	 */
	
?>