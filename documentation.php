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
		    <div class="jumbotron custom-jumbotron">
		    <div class="h2 doc-header ">What is Repogram?</div>
			<br>	
			 The word repogram comes from the words "Repository" and "Chromograms"
			<li> So what is a "Repository"?<br>	
				A repository is a collection of source code files used to develop programs or to manage other files.
				If you ever used GitHub, you will surely have a so called repository.
			<li> Ok, clear on that. What is a "Chromogram"?<br>
				A chromogram is an intelligent visualization method. It can display a huge amount of content on a small
				image. It usually uses blocks.
		    </div>
		    <div class="jumbotron custom-jumbotron">
		    <div class="h3 doc-header">Read that. So how can I use this site?</div>
		    <br>
			That's an easy one. <br>
			Watch this video:<br>
				TODO! Video!
		    </div>
		    <div class="jumbotron custom-jumbotron">
		    <div class="h3 doc-header">Do you have some examples?</div>
			<br>
			<a href="https://github.com/twbs/bootstrap.git">Twitter Bootstrap</a><br>
			<p align="center">
			<div id="overscroll">
			  <svg id="repograms" height="512" width="768" 
     						xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  							<image x="0" y="0" height="512" width="768"  xlink:href="img/exampleBootstrap.svg"/> </svg>

			</div>			
			</p>
			<br>
			<a href="https://github.com/jquery/jquery.git">JQuery</a><br>
			<p align="center">
			  <svg id="repograms" height="512" width="768" 
     						xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  							<image x="0" y="0" height="512" width="768"  xlink:href="img/examplejQuery.svg"/> </svg>

			</p>

		    </div>
		</p>
    	<div id="push"></div>
	</div>
	
	<!-- Footer -->
	<?php include('footer.php')?>
</body>

</html>
