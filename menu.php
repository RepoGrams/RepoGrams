<?php 
	session_start();  
	require_once("php/language.php"); 
	if (!isset($_COOKIE["language"])) {
		setcookie("language", "en", time()+3600000, "/");
	}
?>
<div>
	<div style="float:left; margin-left: 20px; margin-top:20px;">
		<a href="php/language.php?langkey=en"><img src="img/blank.png" class="flag flag-us"></a>
		<a href="php/language.php?langkey=de"><img src="img/blank.png" class="flag flag-de"></a>
		<a href="php/language.php?langkey=fr"><img src="img/blank.png" class="flag flag-fr"></a>
	</div>
	<div style="float:right; margin-right: 20px; margin-top:20px;">
		<a class="btn btn-default btn-lg" href="documentation.php" title="<?php print msg('Open the documentation');?>">
			<span class="glyphicon glyphicon-book"></span>	
		</a>
	</div>
</div>