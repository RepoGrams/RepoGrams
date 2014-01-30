<?php 
session_start();
require_once("php/language.php");
require_once("php/functions.php");
$error = (isset($_SESSION['error_message']) && str_replace(' ','',$_SESSION['error_message']) !== '');
if(!isset($_SESSION['init']) || $error){
        error_log("initializing...");
	initSession(false);
	$_SESSION['init'] = true;
}
?>
<html !DOCTYPE HTML>
<head>
	<?php include('header.php'); ?>
</head>

<body>
	<!-- Warning if javascript is disabled -->
	<noscript>
    	<p style="text-align:center; color: white; background-color: red;">
    		<?php print msg('javascript') ?>
    	</p>
	</noscript>

	<!-- Menu in its own container -->
	<?php include('menu.php'); ?>
	
	<!-- Content in root container-->
	<div class="container" id="wrap"> <!-- open root container-->
	  
	  <div  class="row">
	  <div class="col-xs-12 col-sm-12 col-md-offset-4 col-md-4">  <!--Responsive title -->
	    <img class="title" title="Repograms" src="img/title.png" onclick="location.href='index.php'">
	    <br>
	  </div>
	  </div>

	  <!--Input form  -->
	  <div class="row">
	  <div class="col-xs-12">
		<form role="form" action="./loading.php" method="POST">
			<div class="input-group urlinput <?php if ($error) echo 'has-error';?>">
	<input class="form-control" id="repourl" name="repourl" type="text" required="required" placeholder="<?php print msg('index-enter'); ?>">

      			    	
			</div>

	  		<!-- Error Handling -->
	  		<?php 
				if ($error) {
					echo '<br>
		                  <div class="alert-dismissable errormessage">
       				  	  	<button type="button" class="close glyphicon glyphicon-remove-sign" style="float:left; right:0px;" data-dismiss="alert" aria-hidden="true"></button>
       						<span class="help-block"><strong>&nbsp;&nbsp;'.msg('bug-error').'</strong> '.$_SESSION['error_message'].'</span>
      				  	  </div>';
					unset($_SESSION['error_message']);
					initSession(true);
				}
			?>
			
			<br>
		<div class="centerButton">
<button class="btn btn-primary" type="submit" title="<?php print msg('index-vis'); ?>">
       					<span class="glyphicon glyphicon-indent-left"></span><?php print msg('visualize'); ?>
					</button>
				<button type="button" class="btn btn-default" onclick="example();"><?php print msg('index-examples'); ?></button>
										<button class="btn btn-info" data-toggle="modal" data-target="#help" title="<?php print msg('index-help'); ?>" type="submit">
						<span class="glyphicon glyphicon-question-sign "></span> <?php print msg('index-help'); ?>
					</button>

		  </div>
			<br>
		<!-- Date picker -->
    		<div class="datepick">
    			<span><?php print msg('index-select'); ?> </span>
    			<input type="text" class="input-small hasDatepicker" name="start" id="start" style="width:90px;"/>
    			<span> <?php print msg('index-till'); ?> </span>
    			<input type="text" class="input-small hasDatepicker" name="end" id="end"  style="width:90px;"/>
    		</div>
		</form>
	  </div> <!-- collapse div for form input -->
	  </div>
	  <br><br>
	  
	  <!-- Examples -->
	<br>
<div id="description"></div>
	</div>
	
	</div> <!-- root container close -->
	<div id="example" class="centerButton hidden">
	<?php require_once('./php/exampleBootstrap.php') ?>
	</div>
	<!-- Help dialog -->
	<?php include('helpdialog.php'); ?>
	<div id="push"></div>

	<!-- Footer -->	
	<?php include('footer.php'); ?>
	
	<script>
		$(function() {
		 	$( "#start" ).datepicker({
		 	defaultDate: "+1w",
		 	changeMonth: true,
		 	numberOfMonths: 1,
		 	onClose: function( selectedDate ) {
		 	$( "#end" ).datepicker( "option", "minDate", selectedDate );}});
		 	$( "#end" ).datepicker({
		 	defaultDate: "+1w",
		 	changeMonth: true,
		 	numberOfMonths: 1,
		 	onClose: function( selectedDate ) {
			$( "#start" ).datepicker( "option", "maxDate", selectedDate );}});
		});
		document.getElementById("start").value="01/01/1970";
		document.getElementById("end").value="<?php date_default_timezone_set ('UTC');echo date('m/d/Y');?>";
	</script>
</body>
</html>
