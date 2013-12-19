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
	<!-- Menu -->
	<?php include('menu.php'); ?>
	
	<!-- Content -->
	<div class="container" id="wrap">
		<img class="title" title="Repograms" src="img/title.png" onclick="location.href='index.php'">
		<br>
    	<?php $error = (isset($_SESSION['error_message']) && str_replace(' ','',$_SESSION['error_message']) !== ''); ?>
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
		<br><br>
		<div class="examples">
			<div class="well example lead btn btn-lg" onclick="example('https://github.com/jquery/jquery.git');">
				<img title="JQuery" src="img/examples/jquery.png">
				<br>
				JQuery
			</div> 
			<div class="well example lead btn btn-lg"  onclick="example('https://github.com/twbs/bootstrap.git');">
				<img title="Twitter Bootstrap" src="img/examples/bootstrap.png">
				<br>
				Twitter Bootstrap
			</div> 
			<div class="well examplelast lead btn btn-lg"  onclick="example('https://github.com/git/git.git');">
				<img title="Git" src="img/examples/git.png">
				<br>
				Git
			</div>
		</div>
		<div class="clear push"></div>
	</div>

	<!-- Help dialog -->
	<?php include('helpdialog.php')?>
	
	<!-- Footer -->	
	<?php include('footer.php')?>
	
	<script type="text/javascript">
    	$('.input-daterange').datepicker({
    		format: "mm-dd-yyyy",
        	calendarWeeks: true,
       	 	autoclose: true,
        	todayHighlight: true
        });
	</script>
</body>
</html>
