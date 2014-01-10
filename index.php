<?php 
session_start();
require_once("php/functions.php");
if(!isset($_SESSION['init'])){
	initSession(true);
	$_SESSION['init'] = true;
}
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

	  <div class="col-xs-12 col-sm-12 col-md-offset-4 col-md-4">  <!--Responsive title -->
	    <img class="title" title="Repograms" src="img/title.png" onclick="location.href='index.php'">
	    <br>
	  </div>

	  <!-- Error Handling -->
	  <?php $error = (isset($_SESSION['error_message']) && str_replace(' ','',$_SESSION['error_message']) !== ''); ?>

	  <!--Input form  -->
	  <div class="col-xs-12">
		<form role="form" action="./loading.php" method="POST">
   			<div class="input-group urlinput <?php if ($error) echo 'has-error';?>">			
   				<input class="form-control" id="repourl" name="repourl" type="text" required="required"  placeholder="Enter repository url">
    			<span class="input-group-btn">
       				<button class="btn btn-default" type="submit" title="Visualize the provided repository">
       					<span class="glyphicon glyphicon-indent-left"></span>Visualize!
				</button>
				<button class="btn btn-default btn-default" data-toggle="modal" data-target="#help" title="Quick Help" type="submit">
					<span class="glyphicon glyphicon-hand-left "></span>Help
				</button>
     			</span>
			</div>
			
			<!-- print error message -->
			<?php if ($error) {
				echo '<br><div class="alert-dismissable errormessage">
       				  	<button type="button" class="close glyphicon glyphicon-remove-sign" style="float:left; right:0px;" data-dismiss="alert" aria-hidden="true"></button>
       						<span class="help-block"><strong>&nbsp;&nbsp;Error!</strong> '.$_SESSION['error_message'].'</span>
      				  </div>';
				unset($_SESSION['error_message']);
				
				initSession(true);
			}
			?>
			
			<!-- Date picker -->
		  <br>
    		  <div class="input-daterange urlinput" id="datepicker">
    			<span>Select commits from </span>
    			<input type="text" class="input-small" name="start" value="00-00-00"/>
    			<span> till </span>
    			<input type="text" class="input-small" name="end" value="<?php date_default_timezone_set ( 'UTC' );echo date('m-d-y');?>"/>
    		  </div>
		</form>
	  </div> <!-- collapse div for form input -->
	  <br>
	  <br>
	  <div class="col-md-offset-5 col-md-2">
		<a href="examples.php">
		  <button type="button" class="btn btn-info">Show me some examples
		  </button>
		</a>
	  </div>
	</div> <!-- root container close -->

	<!-- Help dialog -->
	<?php include('helpdialog.php')?>
	
	<!-- Footer -->	
	<?php include('footer.php')?>
	
</body>
</html>
