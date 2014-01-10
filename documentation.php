<?php session_start();

  $GLOBALS["messages"] = array (
    'en'=> array(
    	'Visualize!' 
          => 'Visualize!',
      'Documentation' 
      		=> 'Documentation',
      'What is Repogram?' 
      		=> 'What is Repogram?',
      'The word repogram comes from the words "Repository" and "Chromograms"' 
      		=> 'The word repogram comes from the words "Repository" and "Chromograms"',
      'So what is a "Repository"?' 
      		=> 'So what is a "Repository"?',
      'A repository is a collection of source code files used to develop programs or to manage other files. If you ever used GitHub, you will surely have a so called repository.' 
      		=> 'A repository is a collection of source code files used to develop programs or to manage other files. If you ever used GitHub, you will surely have a so called repository.',
      'Ok, clear on that. What is a "Chromogram"?' 
      		=> 'Ok, clear on that. What is a "Chromogram"?',
      'A chromogram is an intelligent visualization method. It can display a huge amount of content on a small image. It usually uses blocks.' 
      		=> 'A chromogram is an intelligent visualization method. It can display a huge amount of content on a small image. It usually uses blocks.',
      'Read that. So how can I use this site?' 
      		=> 'Read that. So how can I use this site?',
      'That\'s an easy one.' 
      		=> 'That\'s an easy one.',
      'You just need to go to the frontpage, enter the URL of your repository and click on' 
      		=> 'You just need to go to the frontpage, enter the URL of your repository and click on',
      'After a short waiting time, you will see your rendered chromogram.' 
      		=> 'After a short waiting time, you will see your rendered chromogram.',
      'Do you have some examples?' 
      		=> 'Do you have some examples?',
      'Twitter Bootstrap' 
      		=> 'Twitter Bootstrap',
      'JQuery' 
      		=> 'JQuery',
      'Visualize the provided repository' 
      		=> 'Visualize the provided repository'
    ),
 
    'de'=> array(
    	'Visualize!'
      => 'Visualisieren!',
      'Documentation'
			=> 'Dokumentation',
      'What is Repogram?'
			=> 'Was ist ein Repogram?',
      'The word repogram comes from the words "Repository" and "Chromograms"'
			=> 'Das Wort Repogram kommt von den W&ouml;rtern "Repository" und "Chromograms".',
      'So what is a "Repository"?'
			=> 'Also, was ist ein "Repository"?',
      'A repository is a collection of source code files used to develop programs or to manage other files. If you ever used GitHub, you will surely have a so called repository.'
			=> 'Ein Repository ist entweder eine Sammlung von Quellcodedateien, welche zum Entwickeln von Programmen benutzt werden oder wird verwendet um andere Dateien zu verwalten. Hat man jemals GitHub benutzt, hat man sicher auch ein sogenanntes Repository.',
      'Ok, clear on that. What is a "Chromogram"?'
			=> 'Ok, klar soweit. Was ist ein "Chromogram"?',
      'A chromogram is an intelligent visualization method. It can display a huge amount of content on a small image. It usually uses blocks.'
			=> 'Ein Chromogram ist eine intelligente Visualisierungs-Methode. Dadurch k&ouml;nnen große Mengen an Informationen in einem Bild dargestellt werden. Dazu werden häufig Blöcke verwendet.',
      'Read that. So how can I use this site?'
			=> 'Auch verstanden. Wie benutze ich also diese Seite?',
      'That\'s an easy one.'
			=> 'Das ist einfach.',
      'You just need to go to the frontpage, enter the URL of your repository and click on'
			=> 'Auf der Hauptseite kann man eine URL einf&uumlgen und klickt: ',
      'After a short waiting time, you will see your rendered chromogram.'
			=> 'Nach einer kurzen Bearbeitungszeit, wird das berechnete Chromogram erscheinen.',
      'Do you have some examples?'
			=> 'Gibt es Beispiele?',
      'Twitter Bootstrap'
			=> 'Twitter Bootstrap',
      'JQuery'
			=> 'JQuery',
      'Visualize the provided repository'
			=> 'Visualisiere das vorgegebene Repository'
    ),

    'fr' => array(
    	'Visualize!' 
          => 'Visualise!',
      'Documentation' 
      		=> 'Documentation',
      'What is Repogram?' 
      		=> 'C\'est quoi, un Repogram?',
      'The word repogram comes from the words "Repository" and "Chromograms"' 
      		=> 'Le mot repogram vient des mots "Repository" et "Chromograms"',
      'So what is a "Repository"?' 
      		=> 'Donc, c\'est quoi, un "Repository"?',
      'A repository is a collection of source code files used to develop programs or to manage other files. If you ever used GitHub, you will surely have a so called repository.' 
      		=> 'Un r&eacute;f&eacute;rentiel est une collection de fichiers de code source utilis&eacute; pour d&eacute;velopper des programmes ou pour g&eacute;rer d\'autres fichiers. Si vous avez d&eacute;j&agrave; utilis&eacute; GitHub, vous aurez s&ucirc;rement un r&eacute;f&eacute;rentiel dite.',
      'Ok, clear on that. What is a "Chromogram"?' 
      		=> 'Ok, clair. Qu\'est-ce qu\'un "Chromogram"?',
      'A chromogram is an intelligent visualization method. It can display a huge amount of content on a small image. It usually uses blocks.' 
      		=> 'Un Chromogram est une m&eacute;thode de visualisation intelligent. Il peut afficher une grande quantit&eacute; de contenu sur une petite image. Habituellement il utilise des blocs.',
      'Read that. So how can I use this site?' 
      		=> 'Lire. Alors, comment puis-je utiliser ce site?',
      'That\'s an easy one.' 
      		=> 'C\'est facile.',
      'You just need to go to the frontpage, enter the URL of your repository and click on' 
      		=> 'Vous avez juste besoin d\'aller &agrave; la page d\'accueil, entrez l\'URL de votre r&eacute;f&eacute;rentiel et cliquez sur',
      'After a short waiting time, you will see your rendered chromogram.' 
      		=> 'Apr&egrave;s un court temps d\'attente, vous verrez votre Chromogram rendu.',
      'Do you have some examples?' 
      		=> 'Y at-il des exemples?',
      'Twitter Bootstrap' 
      		=> 'Twitter Bootstrap',
      'JQuery'
      		=> 'JQuery',
      'Visualize the provided repository'
      		=> 'Visualisez le repository pr&eacute;vu'
      )

);
 
function msg($s) {
  $locale = 'en';
    
  if (isset($GLOBALS["messages"][$locale][$s])) {
    return $GLOBALS["messages"][$locale][$s];
  } else {
    error_log("l10n error: locale: "."$locale, message:'$s'");
  }
}
?>

<html !DOCTYPE HTML>
<head>
	<?php include('header.php')?>
</head>

<body>
	<!-- Menu -->	
	<div style="float:left; margin-left: 20px; margin-top:20px;">
		<img src="img/blank.png" class="flag flag-us">
		<img src="img/blank.png" class="flag flag-de">
		<img src="img/blank.png" class="flag flag-fr">
	</div>
	<div class="clear"></div>
	<div style="float:right; margin-right: 20px; margin-top:20px;">
		<a class="btn btn-default btn-lg" href="<?php echo $_SERVER['HTTP_REFERER']; ?>" title="Go back">
			<span class="glyphicon glyphicon-arrow-left"></span>	
		</a>
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
