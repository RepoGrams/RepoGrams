<?php 
session_start();
require_once("php/language.php");
require_once("php/functions.php");
if(!isset($_SESSION['init'])){
	initSession(true);
	$_SESSION['init'] = true;
}
$error = (isset($_SESSION['error_message']) && str_replace(' ','',$_SESSION['error_message']) !== '');
?>
<html !DOCTYPE HTML>
<head>
	<?php include('header.php')?>
</head>

<body>
	<!-- Menu in its own container -->
	<?php include('menu.php'); ?>
	
	<!-- Content in root container-->
	<div class="container" id="wrap"> <!-- open root container-->
	  
	  <div class="row">
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
   				<input class="form-control" id="repourl" name="repourl" type="text" required="required"  placeholder="<?php print msg('Enter repository url'); ?>">
    			<span class="input-group-btn">
       				<button class="btn btn-default" type="submit" title="Visualize the provided repository">
       					<span class="glyphicon glyphicon-indent-left"></span><?php print msg('Visualize!'); ?>
					</button>
					<button class="btn btn-default btn-default" data-toggle="modal" data-target="#help" title="Quick Help" type="submit">
						<span class="glyphicon glyphicon-hand-left "></span><?php print msg('Help'); ?>
					</button>
     			</span>
			</div>

	  		<!-- Error Handling -->
	  		<?php 
				if ($error) {
					echo '<br>
		                  <div class="alert-dismissable errormessage">
       				  	  	<button type="button" class="close glyphicon glyphicon-remove-sign" style="float:left; right:0px;" data-dismiss="alert" aria-hidden="true"></button>
       						<span class="help-block"><strong>&nbsp;&nbsp;'.msg('Error!').'</strong> '.msg($_SESSION['error_message']).'</span>
      				  	  </div>';
					unset($_SESSION['error_message']);
					initSession(true);
				}
			?>
			
			<!-- Date picker -->
		  	<br>
    		<div class="datepick">
    			<span><?php print msg('Select commits from'); ?> </span>
    			<input type="text" class="input-small hasDatepicker" name="start" id="start"/>
    			<span> <?php print msg('till'); ?> </span>
    			<input type="text" class="input-small hasDatepicker" name="end" id="end"/>
    		</div>
		</form>
	  </div> <!-- collapse div for form input -->
	  </div>
	  <br><br>
	  
	  <!-- Examples -->
	  <div class="row">
	  <div class="col-md-offset-5 col-md-2">
		<button type="button" class="btn btn-info" onclick="example();"><?php print msg('Show me some examples'); ?></button>
	  </div>
	  </div>
	</div> <!-- root container close -->

	<!-- Help dialog -->
	<?php include('helpdialog.php')?>
	
	<!-- Footer -->	
	<?php include('footer.php')?>
	
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
