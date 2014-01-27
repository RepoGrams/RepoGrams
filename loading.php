<?php
session_start();
require_once("php/functions.php");
require_once("php/language.php");

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
?>

<html !DOCTYPE HTML>
<head>
	<?php include('header.php'); ?>
</head>

<body>
	<!-- Warning if javascript is disabled -->
	<noscript>
    	<p style="text-align:center; color: white; background-color: red;">
    		<?php print msg('Looks like javascript is disabled in your browser. Please activate it to be able to use all the functions of this page.') ?>
    	</p>
	</noscript>
	
	<!-- Menu -->
	<?php include('menu.php'); ?>

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

	<script type="text/javascript">
	function requestImage(currentState) {
          jQuery.ajax({
            dataType: "json",
            type: "POST",
            url:"php/action.php", 
            success: function(data){
                  if(data.error == true){
                    window.location.href= "/index.php"
                    console.log("Error detected");
                    return;
                  }
		if(data.finished == true) {
			console.log("changing location...");
			window.location.href = "/image.php";
			console.log("changed location...");
		} else {
			$("#loadtext").html(<?php msg('Rendering image')?>);
			$("#mainbar").attr( "aria-valuenow","50");
			$("#mainbar").css({"width":"50%"});
			requestImage(1);
			}
            },
            data: {state: currentState}
          });
	}
	requestImage(0);
	</script>
</body>
</html>
