<?php
  $GLOBALS["messages"] = array (
    'en'=> array(
      'Visualize!' => 'Visualize!',
      'Help' => 'Help',
      'Show me some examples' => 'Show me some examples',
      'Enter repository url' => 'Enter repository url',
      'Select commits from' => 'Select commits from',
      'till' => 'till',
      'Cloning repository into folder.' => 'Cloning repository into folder.',
      'Abort' => 'Abort',
      'Error! Fetching repository was not sucessfull (Invalid URL?)' => 'Error! Fetching repository was not sucessfull (Invalid URL?)',
      'Legend' => 'Legend',
      'Documentation' => 'Documentation',
      'What is Repogram?' => 'What is Repogram?',
      'The word repogram comes from the words "Repository" and "Chromograms"' => 'The word repogram comes from the words "Repository" and "Chromograms"',
      'So what is a "Repository"?' => 'So what is a "Repository"?',
      'A repository is a collection of source code files used to develop programs or to manage other files.
      If you ever used GitHub, you will surely have a so called repository.' => 'A repository is a collection of source code files used to develop programs or to manage other files.
      If you ever used GitHub, you will surely have a so called repository.',
      'Ok, clear on that. What is a "Chromogram"?' => 'Ok, clear on that. What is a "Chromogram"?',
      'A chromogram is an intelligent visualization method. It can display a huge amount of content on a small
      image. It usually uses blocks.' => 'A chromogram is an intelligent visualization method. It can display a huge amount of content on a small
      image. It usually uses blocks.',
      'Read that. So how can I use this site?' => 'Read that. So how can I use this site?',
      'That\'s an easy one.' => 'That\'s an easy one.',
      'You just need to go to the frontpage, enter the URL of your repository and click on' => 'You just need to go to the frontpage, enter the URL of your repository and click on',
      'After a short waiting time, you will see your rendered chromogram.' => 'After a short waiting time, you will see your rendered chromogram.',
      'Do you have some examples?' => 'Do you have some examples?',
      'Twitter Bootstrap' => 'Twitter Bootstrap',
      'JQuery' => 'JQuery',
      'This website renders chromograms of your git repository.' => 'This website renders chromograms of your git repository.',
      'To start just enter your repository URL and click on visualize.' => 'To start just enter your repository URL and click on visualize.',
      'To see some examples, just choose one from below and then click' => 'To see some examples, just choose one from below and then click',
      'Visualize the provided repository' => 'Visualize the provided repository',
      'Large repository may need some time to be downloaded and processed.' => 'Large repository may need some time to be downloaded and processed.',
      'So please be patient and get some coffee while waiting ;)' => 'So please be patient and get some coffee while waiting ;)',
      'Close' => 'Close'
    ),
 
    'de'=> array(
      'Visualize!'
			=> 'Visualisieren!',
      'Help'
			=> 'Hilfe',
      'Show me some examples'
			=> 'Zeige mir ein paar Beispiele',
      'Enter repository url'
			=> 'Repository URL einf&uuml;gen',
      'Select commits from'
			=> 'Commits einfügen von',
      'till'
			=> 'bis',
      'Cloning repository into folder.'
			=> 'Klone Repository in Ordner.',
      'Abort' 
			=> 'Abbrechen',
      'Error! Fetching repository was not sucessfull (Invalid URL?)'
			=> 'Fehler! Runterladen des Repository war nicht erfolgreich (Ung&uuml;ltige URL?)',
      'Legend'
			=> 'Legende',
      'Documentation'
			=> 'Dokumentation',
      'What is Repogram?'
			=> 'Was ist Repogram?',
      'The word repogram comes from the words "Repository" and "Chromograms"'
			=> 'Das Word Repogram kommt von den W&ouml;rtern "Repository" und "Chromograms"',
      'So what is a "Repository"?'
			=> 'Also, was ist ein "Repository"?',
      'A repository is a collection of source code files used to develop programs or to manage other files.
      If you ever used GitHub, you will surely have a so called repository.'
			=> 'Ein Repository ist entweder eine Sammlung von Quell Code Dateien, welche zum Entwickeln von Programmen
			 benutzt werden oder wird verwendet um andere Dateien zu verwalten.
			Hat man jemals GitHub benutzt, hat man sicher auch ein sogenanntes Repository.',
      'Ok, clear on that. What is a "Chromogram"?'
			=> 'Ok, klar soweit. Was ist ein "Chromogram"?',
      'A chromogram is an intelligent visualization method. It can display a huge amount of content on a small image. It usually uses blocks.'
			=> 'Ein Chromogram ist eine intelligente Visualisierungs-Methode. Es kann große Mengen an Informationen in einem Bild darstellen. Dazu werden häufig Blöcke verwendet.',
      'Read that. So how can I use this site?'
			=> 'Auch verstanden. Wie benutze ich also diese Seite?',
      'That\'s an easy one.'
			=> 'Das ist einfach.',
      'You just need to go to the frontpage, enter the URL of your repository and click on'
			=> 'Auf der Hauptseite kann man eine URL einf&uumlgen und klickt;',
      'After a short waiting time, you will see your rendered chromogram.'
			=> 'Nach einer kurzen Bearbeitungszeit, wird das berechnete Chromogram erscheinen.',
      'Do you have some examples?'
			=> 'Gibt es Beispiele?',
      'Twitter Bootstrap'
			=> 'Twitter Bootstrap',
      'JQuery'
			=> 'JQuery',
      'This website renders chromograms of your git repository.'
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
			=> 'Schlie&szlig;en'
    ),
);
 
function msg($s) {
  $locale = 'de';
    
  if (isset($GLOBALS["messages"][$locale][$s])) {
    return $GLOBALS["messages"][$locale][$s];
  } else {
    error_log("l10n error: locale: "."$locale, message:'$s'");
  }
}
?>
 
<?php
  // example of usage 
 
  session_start();
 
  // if _SESSION["locale"] is set to "de", it will output "Sonntag"
  print msg('Sunday');
?>