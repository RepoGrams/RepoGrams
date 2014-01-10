<?php

  $GLOBALS["messages"] = array (
    'en'=> array(
      'Visualize!' 
          => 'Visualize!',
      'This website renders chromograms of your repository.' 
          => 'This website renders chromograms of your repository.',
      'To start just enter your repository URL and click on visualize.' 
          => 'To start just enter your repository URL and click on visualize.',
      'To see some examples, just choose one from below and then click' 
          => 'To see some examples, just choose one from below and then click',
      'Visualize the provided repository' 
          => 'Visualize the provided repository',
      'Large repository may need some time to be downloaded and processed.' 
          => 'Large repository may need some time to be downloaded and processed.',
      'So please be patient and get some coffee while waiting ;)' 
      => 'So please be patient and get some coffee while waiting ;)',
      'Close' 
          => 'Close',
      'Repograms - Quick Help'
          => 'Repograms - Quick Help'
    ),
 
    'de'=> array(
      'Visualize!'
      => 'Visualisieren!',
      'This website renders chromograms of your repository.'
      => 'Diese Webseite berechnet Chromogramme.',
      'To start just enter your repository URL and click on visualize.'
      => 'Zum Starten f&uuml;gt man seine Repository URL ein und klickt auf Visualisieren.',
      'To see some examples, just choose one from below and then click'
      => 'Um einige Beispiele zu sehen klickt man auf ',
      'Visualize the provided repository'
      => 'Visualisiere das vorgegebene Repository',
      'Large repository may need some time to be downloaded and processed.'
      => 'Große Repositories ben&ouml;tigen m&ouml;glicherweise ein wenig Zeit zum Downloaden und Bearbeiten.',
      'So please be patient and get some coffee while waiting ;)'
      => 'Wir bitten um ein wenig Geduld ;)',
      'Close'
      => 'Schlie&szlig;en',
      'Repograms - Quick Help'
      => 'Repograms - Schnelle Hilfe'
    ),

    'fr' => array(
      'Visualize!' 
          => 'Visualise!',
      'This website renders chromograms of your repository.' 
          => 'Ce site rend chromograms de votre repository.',
      'To start just enter your repository URL and click on visualize.' 
          => 'Pour commencer, veuillez entrer votre URL du r&eacute;f&eacute;rentiel et cliquez sur Visualise.',
      'To see some examples, just choose one from below and then click' 
          => 'Pour voir quelques exemples, il suffit de choisir l\'un de ci-dessous puis cliquez sur',
      'Visualize the provided repository'
          => 'Visualisez le repository pr&eacute;vu',
      'Large repository may need some time to be downloaded and processed.' 
          => 'Grand d&eacute;p&ocirc;t peut avoir besoin de temps &agrave; t&eacute;l&eacute;charger et trait&eacute;es.',
      'So please be patient and get some coffee while waiting ;)' 
           => 'Alors s\'il vous plaît &ecirc;tre patient et prendre un caf&eacute; en attendant;)',
      'Close' 
          => 'Ferme',
      'Repograms - Quick Help'
          => 'Repograms - aide rapide'
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

<div class="modal fade" id="help" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
 	<div class="modal-dialog">
    	<div class="modal-content">
      		<div class="modal-header">
       			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
       			<h4 class="modal-title"><?php print msg('Repograms - Quick Help');?></h4>
     		</div>
      		<div class="modal-body">
				<?php print msg('This website renders chromograms of your git repository.');?><br>
				<?php print msg('To start just enter your repository URL and click on visualize.');?><br>
				<?php print msg('To see some examples, just choose one from below and then click');?>
				<button class="btn btn-default" title="<?php print msg('Visualize the provided repository');?>">
       				<span class="glyphicon glyphicon-indent-left"></span><?php print msg('Visualize!');?>
				</button>
				<br><br>
				<div class="alert alert-info inforepo">
					<?php print msg('Large repository may need some time to be downloaded and processed.');?><br>
					<?php print msg('So please be patient and get some coffee while waiting ;)');?>
				</div>
      		</div>
      		<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal"><?php print msg('Close');?></button>
      		</div>
    	</div>
  	</div>
</div>
