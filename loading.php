<?php session_start();?>

<html !DOCTYPE HTML>
<head>
	<?php include('header.php')?>
</head>

<body>
	<!-- Menu -->
	<?php include('menu.php'); ?>
	
	<!-- Content -->
	<div class="container" id="wrap">
		<a href="index.php"><img class="title" title="Repograms" src="img/title.png"></a>
		<br>
    	<img src="img/progress.gif">
    	<p><?php if (isset($_SESSION['loading_info'])) echo $_SESSION['loading_info'];?></p>
		<div id="push"></div>
	</div>
	
	<!-- Footer -->	
	<?php include('footer.php')?>
</body>
</html>
