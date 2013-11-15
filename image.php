<?php session_start();?>

<html !DOCTYPE HTML>
<head>
	<!-- Meta tags -->
	<meta name="description" content="Visualizing commit comments with chromograms">
	<meta name="keywords" content="chromogram, git, commit, comments, project">
	<meta name="author" content="Fabian Kosmale, Heiko Becker, Maike Maas, Marc Jose, Sebastian Becking, Valerie Poser">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta charset="UTF-8">
	
	<!-- Page title -->
	<title>Visualizing commit comments with chromograms</title>
	
	<!-- CSS sources -->
	<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="css/bootstrap-theme.min.css">
	<link rel="stylesheet" type="text/css" href="css/custom.css">
	
	<!-- JS sources -->
	<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="js/jquery.elevateZoom-3.0.8.min.js"></script>
	<script type="text/javascript" src="js/custom.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>

	<!-- Browser fixes -->
	<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
</head>

<body>
	
	<!-- Menu -->
	<nav class="navbar navbar-inverse navbar-static-top" role="navigation">
  		<!-- Brand and toggle get grouped for better mobile display -->
  		<div class="navbar-header">
    		<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
			<span class="sr-only">Toggle navigation</span>
			<span class="icon-bar"></span>
      			<span class="icon-bar"></span>
      			<span class="icon-bar"></span>
      			<span class="icon-bar"></span>
    			</button>
  		</div>

 		<!-- Collect the nav links, forms, and other content for toggling -->
  		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
		<ul class="nav navbar-nav">
			<li><a href="index.php">VCC</a></li>
      			<li><a href="index.php">Home</a></li>
      			<li><a href="render.php">Render</a></li>
      			<li><a href="documentation.php">Documentation</a></li>
    		</ul>
    
    		<form class="navbar-form navbar-right" role="search" action="php/action.php" method="POST">
      			<div class="form-group">
        			<input type="text" id="projectlink" name="projectlink" class="form-control" placeholder="Enter repository url" size="100" required="required">
      			</div>
      			<button class="btn btn-default" type="submit">
        			<span class="glyphicon glyphicon-indent-left"></span>Visualize!
        		</button>
    		</form>
  		</div>
	</nav>

	
	<!-- Content -->
	<div class="container" id="wrap">
    	<div class="hero-unit">
    		<?php
				echo '<div class="color-legend">
						<div class="legend-title">Legend</div>
						<div class="legend-scale">
  							<ul class="legend-labels">
   			 					<li><span style="background:#8DD3C7;"></span>One</li>
    							<li><span style="background:#FFFFB3;"></span>Two</li>
    							<li><span style="background:#BEBADA;"></span>Three</li>
    							<li><span style="background:#FB8072;"></span>Four</li>
    							<li><span style="background:#80B1D3;"></span>etc</li>
  							</ul>
						</div>
					  </div>
					  <div class="panel panel-default" style="height: 75%; min-height: 532px; width: 70%; min-width: 512px; margin: auto auto 0;">
  						  <div class="panel-heading">'.$_GET["title"].'</div>			  	
						  <div class="panel-body" style="height: 75%; min-height: 532px; width: 70%; min-width: 512px; margin: auto auto 0;">
    						<img id="zoom_01" data-zoom-image="'.$_GET["image_large"].'" src="'.$_GET["image_small"].'" style="width: 100%; height: 92%;">
  							<script type="text/javascript">$("#zoom_01").elevateZoom();</script> 
						  </div>
					  </div>';
			?>	  
    	</div>
    	<div id="push"></div>
	</div>
	
	
	<!-- Footer -->
	<div class="credit" id="footer">
			<br>
			<p class="muted credit">&copy;<?php echo date("Y")?> Fabian Kosmale, Heiko Becker, Maike Maas, Marc Jose, Sebastian Becking, Valerie Poser</p>		
	</div>
</body>
</html>
