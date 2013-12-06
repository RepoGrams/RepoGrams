<?php session_start();?>

<html !DOCTYPE HTML>
<head>
	<?php include('header.php')?>
</head>

<body>
	<!-- Menu -->	
	<div style="float:right; margin-right: 20px; margin-top:20px;">
		<a class="btn btn-default btn-lg" href="<?php echo $_SERVER['HTTP_REFERER']; ?>" title="Go back">
			<span class="glyphicon glyphicon-arrow-left"></span>	
		</a>
	</div>
	
	<!-- Content -->
	<div class="container" id="wrap">
		<img class="title" title="Repograms" src="img/title.png" onclick="location.href='index.php'">
		<div class="h1">Documentation</div>
		<br>
		<p class="lead">
			Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   
			<br><br>
			Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet,
		</p>
    	<div id="push"></div>
	</div>
	
	<!-- Footer -->
	<?php include('footer.php')?>
</body>

</html>
