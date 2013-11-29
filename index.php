<?php session_start();?>

<html !DOCTYPE HTML>
<head>
	<?php include('header.php')?>
</head>

<body>
	<!-- Menu -->
	<?php include('menu.php'); ?>
	
	<!-- Content -->
	<div class="container" id="wrap">
		<a href="index.php"><img class="title" title="Repograms" src="img/title.png"></a>
		<br>
    	<?php
    		$error = (isset($_SESSION['error_message']) && str_replace(' ','',$_SESSION['error_message']) !== '');
			if (isset($_SESSION['loading']) && $_SESSION['loading']) {
 				//header('loaction: loading.php');
			} else {
				echo '<form role="form" action="./php/action.php" method="POST">
   						<div class="input-group urlinput ';
				if ($error) echo 'has-error';
   				echo '">
   							<input class="form-control" id="projectlink" name="projectlink" type="text" required="required"  placeholder="Enter repository url">
    						<span class="input-group-btn">
       							<button class="btn btn-default" type="submit" title="Visualize the provided repository">
       								<span class="glyphicon glyphicon-indent-left"></span>Visualize!
								</button>
								<button class="btn btn-default btn-default" data-toggle="modal" data-target="#help" title="Quick Help" type="submit">
									<span class="glyphicon glyphicon-hand-left "></span>Help
								</button>
     						</span>
						</div>';
				if ($error) {
					echo '<div class="alert-dismissable errormessage">
       							<button type="button" class="close glyphicon glyphicon-remove-sign" style="float:left; right:0px;" data-dismiss="alert" aria-hidden="true">     							</button>
       								<span class="help-block"><strong>&nbsp;&nbsp;Error!</strong> '.$_SESSION['error_message'].'</span>
       					  </div>';
					unset($_SESSION['error_message']);
				}
				echo '</form>';
			}
		?>	
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
		<div id="push"></div>

	</div>

<div class="modal fade" id="help" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">Repograms - Quick Help</h4>
      </div>
      <div class="modal-body">
	This Website renders Chromograms of your git repository.<br>
	To start just eter your repository URL and click on visualize.<br>
	To see some examples, just click one below and then the <button class="btn btn-default" title="Visualize the provided repository">
       								<span class="glyphicon glyphicon-indent-left"></span>Visualize!
								</button>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
	
	<!-- Footer -->	
	<?php include('footer.php')?>
</body>
</html>
