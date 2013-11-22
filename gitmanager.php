<html>
	<head>
		<title>Repogram Manager</title>
		<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />
		<link rel="stylesheet" type="text/css" href="css/bootstrap-responsive.min.css" />
	</head>
	<style>
		input{
			width: 200px !important;
			/*height: 50px;
			margin: 5px;*/
		}
		form{
			padding: 0px;
			margin: 0px 20px 0px 0px;
			float: left;
		}
		#content{
			padding: 20px;
		}
		hr{
			margin-top: 20px;
			margin-bottom: 20px;
			/*color: #808080;*/
		}
	</style>
	<body>
		<div id=content>
		<div class="hero-unit">
			<h1>Repogram Manager</h1>
		</div>

		<h2>Git Pull</h2>
		<form method="post" action="gitmanager.php">
			<input type="hidden" name="pull" value="master" />
			<input type="submit" value="git pull master" class="btn btn-large btn-primary" />
		</form>
		<div style="clear: both;"></div>
		<br />
		<?php
		if (isset($_POST['pull'])){
			$dir = $_POST['pull'];
			if ($dir == 'master'){
				echo "<pre>";
				echo shell_exec("git pull 2>&1");
				echo "</pre>";
			}else{
				$dir = htmlentities($dir);
				echo "Illegal value: $dir";
			}
		}elseif (isset($_POST['status'])){
			$dir = $_POST['status'];
			if ($dir == 'master'){
				echo "<pre>";
				echo shell_exec("git status 2>&1");
				echo "</pre>";
			}else{
				$dir = htmlentities($dir);
				echo "Illegal value: $dir";
			}
		}
		?>
		</div>
	</body>
</html>
