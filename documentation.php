<?php 
	session_start();
	require_once("php/language.php");
	
	if (!isset($_COOKIE["language"])) {
		setcookie("language", "en", time()+3600000, "/");
	}
?>

<html !DOCTYPE HTML>
<head>
	<?php include('header.php')?>
</head>

<body>
	<!-- Menu -->
	<div>
		<div style="float:left; margin-left: 20px; margin-top:20px;">
			<a href="php/language.php?langkey=en"><img src="img/blank.png" class="flag flag-us"></a>
			<a href="php/language.php?langkey=de"><img src="img/blank.png" class="flag flag-de"></a>
			<a href="php/language.php?langkey=fr"><img src="img/blank.png" class="flag flag-fr"></a>
		</div>
		<div style="float:right; margin-right: 20px; margin-top:20px;">
			<a class="btn btn-default btn-lg" href="<?php echo $_SERVER['HTTP_REFERER']; ?>" title="Go back">
				<span class="glyphicon glyphicon-arrow-left"></span>	
			</a>
		</div>
	</div>	

	
	<!-- Content -->
	<div class="container" id="wrap">
		<img class="title" title="Repograms" src="img/title.png" onclick="location.href='index.php'">
		<div class="h1"><?php print msg('Documentation');?></div>
		<br>
		<p class="lead">
		    <div class="jumbotron custom-jumbotron">
		    <div class="h2 doc-header "><?php print msg('What is Repogram?');?></div>
			<br>	
			 <?php print msg('The word repogram comes from the words "Repository" and "Chromograms"');?>
			<li> <?php print msg('So what is a "Repository"?');?><br>	
				<?php print msg('A repository is a collection of source code files used to develop programs or to manage other files. If you ever used GitHub, you will surely have a so called repository.');?>
			<li> <?php print msg('Ok, clear on that. What is a "Chromogram"?');?><br>
				<?php print msg('A chromogram is an intelligent visualization method. It can display a huge amount of content on a small image. It usually uses blocks.');?>
		    </div>
		    <div class="jumbotron custom-jumbotron">
		    <div class="h3 doc-header"><?php print msg('Read that. So how can I use this site?');?></div>
		    <br>
			<?php print msg('That\'s an easy one.');?> <br>
			<?php print msg('You just need to go to the frontpage, enter the URL of your repository and click on');?>
			<button class="btn btn-default" title="<?php print msg('Visualize the provided repository');?>">
       			<span class="glyphicon glyphicon-indent-left"></span><?php print msg('Visualize!');?>
			</button> <br>
			<?php print msg('After a short waiting time, you will see your rendered chromogram.');?>
 
		    </div>
		    <div class="jumbotron custom-jumbotron">
		    <div class="h3 doc-header"><?php print msg('Do you have some examples?');?></div>
			<br>
			<a class="h3" href="https://github.com/twbs/bootstrap.git"><?php print msg('Twitter Bootstrap');?></a><br><br>
			<p align="center">
			  <svg class="borderimage" id="repograms" height="512" width="768" 
     						xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  							<image x="0" y="0" height="512" width="768"  xlink:href="img/exampleBootstrap.svg"/> </svg>

			</p>
			<br>
			<a class="h3" href="https://github.com/jquery/jquery.git"><?php print msg('JQuery');?></a><br><br>
			<p align="center">
			  <svg class="borderimage" id="repograms" height="512" width="768" 
     						xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  							<image x="0" y="0" height="512" width="768"  xlink:href="img/examplejQuery.svg" /> </svg>

			</p>

		    </div>
		</p>
    	<div id="push"></div>
	</div>
	
	<!-- Footer -->
	<?php include('footer.php')?>
</body>

</html>
