<?php session_start();?>

<html !DOCTYPE HTML>
<head>
	<?php include('header.php')?>
</head>

<body>
	
	<!-- Menu -->
	<?php include('menu.php'); makemenu(1);?>
	
	<!-- Content -->
	<div class="container" id="wrap">
		<img class="title" src="img/title.png"></a>
		<br><br><br>
    	<div class="hero-unit">
    		<?php
				if (isset($_SESSION['loading']) && $_SESSION['loading']) {
 					echo '<br><br>
						  <div class="progress progress-striped active">
  						  	<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:'.$_SESSION['current_progress'].'%;"></div>
						  </div>
						  <p>'.$_SESSION['loading_info'].'</p>';
				} else if (isset($_SESSION['current_progress']) && $_SESSION['current_progress'] == 100) {
					unset($_SESSION['current_progress']);
					unset($_SESSION['loading']);
					unset($_SESSION['loading_info']);
					header('Location: image.php');
				} else {
					echo '<form role="form" action="php/action.php" method="POST">
    					  	<legend>Enter the link for your project</legend>
    						<div class="input-group">
    							<input class="form-control" id="projectlink" name="projectlink" type="text" required="required" size="143" placeholder="Enter repository url">
     							<span class="input-group-btn">
        							<button class="btn btn-default" type="submit">
        								<span class="glyphicon glyphicon-indent-left"></span>Visualize!
        							</button>
      							</span>
							</div>';
					if (isset($_SESSION['error_message']) && str_replace(' ','',$_SESSION['error_message']) !== '') {
						echo '<div class="alert alert-danger alert-dismissable">
  						  	  	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
  								<strong>Error!</strong> '.$_SESSION['error_message'].'
						      </div>';
						unset($_SESSION['error_message']);
					}
					echo '	<div class="form-group">
  						  		<input class="checkbox-horizontal" type="checkbox" id="history" name="history" value="true" checked="true">Check for history</input>
						 	</div>
			              </form>';
				}
			?>	  
    	</div>    	
    	<div id="push"></div>
	</div>
	
	<!-- Footer -->	
	<?php include('footer.php')?>
</body>
</html>
