<?php
session_start();
require_once("php/functions.php");

$GLOBALS["messages"] = array (
    'en'=> array(
    	'Cloning repository into folder.' 
      		=> 'Cloning repository into folder.',
      	'Abort' 
      		=> 'Abort'
    ),
 
    'de'=> array(
    	'Cloning repository into folder.'
			=> 'Klone Repository in Ordner.',
     	'Abort' 
			=> 'Abbrechen'
    ),

    'fr' => array(
      'Cloning repository into folder.' 
      		=> 'Duplique repository dans un dossier.',
      'Abort' 
      		=> 'Abandon'
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


dump();
if (isset($_POST['repourl'])) 
	$_SESSION['repourl'] = $_POST['repourl'];

if (isset($_POST['start']) && $_POST['start'] != '00-00-00')  {
	$_SESSION['start'] = $_POST['start'];
} else {
	$_SESSION['start'] = "";
}

if (isset($_POST['end']) && $_POST['end'] != date("m-d-y")) {
	$_SESSION['end'] = $_POST['end'];
} else {
	$_SESSION['end'] = "";
}

error_log("start:".$_SESSION['start']);
error_log("end:".$_SESSION['end']);

if ($_SESSION['finish']) 
	header('location:image.php');

if(isset($_SESSION['error']) && $_SESSION['error']) {
        error_log("got errror");
        unset($_SESSION['error']);
	$_SESSION['finish'] = true;
	header('Location:index.php');
}
?>

<html !DOCTYPE HTML>
<head>
	<?php include('header.php')?>
	<!--<meta http-equiv="refresh" content="5">-->
</head>

<body>
<!-- Menu -->
<?php 
include('menu.php');
?>

	<!-- Content -->
	<div class="container" id="wrap">
		<a href="index.php"><img class="title" title="Repograms" src="img/title.png"></a>
		<br>
		<div class="progress progress-striped active">
			<div id="mainbar" class="progress-bar"  role="progressbar" 
					aria-valuenow="0" 
					aria-valuemin="0" aria-valuemax="100" 
					style="width:0%">
     		</div>
		</div>
		<p id="loadtext" class="center">
			<?php print msg('Cloning repository into folder.');?>	
		</p>
			<br><br>
		<div class="center">
			<form role="form" action="./php/abort.php" method="POST">
				<div class="btn-group btn-group-lg">
		  			<button class="btn btn-danger" type="Submit" ><?php print msg('Abort');?></button>
				</div>
		    </form>
		</div>
		<div id="push"></div>
	</div>
	
	<!-- Footer -->	
	<?php include('footer.php')?>

	<?php $_SESSION['state'] =0 ;?>
	<!--include the action.php functions -->
	<script type="text/javascript">
	$(document).ajaxComplete(
		function (){
			$("#loadtext").html("<?php print msg('Rendering image')?>");
		}
	);
	jQuery.ajax("php/action.php");});
	jQuery.ajax("php/action.php");
	</script>
</body>
</html>
