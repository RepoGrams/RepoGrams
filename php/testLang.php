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
      'Error! Fetching git-Repository was not sucessfull (Invalid URL?)' => 'Error! Fetching git-Repository was not sucessfull (Invalid URL?)',
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
      'Monday' => 'Montag',
      'Tuesday' => 'Dienstag',
      'Wednesday' => 'Mittwoch',
      'Thursday' => 'Donnerstag',
      'Friday' => 'Frietag',
      'Saturday' => 'Samstag',
      'Sunday' => 'Sontag'
    )
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