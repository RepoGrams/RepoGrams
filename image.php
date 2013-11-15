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
	<!-- <script type="text/javascript" src="js/jquery.elevateZoom-3.0.8.min.js"></script> -->
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
    		<script type="text/javascript" src="js/jquery.overscroll.min.js"></script>
    		<div class="color-legend">
				<div class="legend-title">Legend</div>
					<div class="legend-scale">
  						<ul class="legend-labels">
  						<?php 
							if (isset($_GET['legend'])) {
								foreach ($_GET['legend'] as $entry) {
									echo '<li><span style="background:rgb('.$entry['c'].');"></span>'.$entry['t'].'</li>';
		               		}
		            	?>
  						</ul>
					</div>
				</div>
			</div>
			<div class="panel panel-default" style="overflow: hidden; height: 555px; width: 514px; margin: auto auto 0;">
  				<div class="panel-heading"><?php echo $_GET["title"] ?></div>
				<div id="overscroll"> 
					<ul>
					<!-- DEMO -->
						<li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li><a id="link" href="javascript:void(0)">Click Me!</a></li><li class="no-drag">Can't drag me!</li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li> <li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li></li><li class="alt"></li><li class="last"></li>
					<!-- DEMO_END -->
					<?php 
						if (isset($_GET['image'])) {
							foreach ($_GET['image'] as $row) {
								foreach ($row as $tile) {
									echo '<li style="background-color:'.$tile['c'].';width:'.$tile['x'].';height:'.$tile['y'].'"></li>';
								}
							}
		                }
		            ?>
					</ul>
				</div>
			</div>
	</div>  
    	</div>
    	<div id="push"></div>
	</div>
	
	
	<!-- Footer -->
	<div class="credit" id="footer">
			<br>
			<p class="muted credit">&copy;<?php echo date("Y")?> Fabian Kosmale, Heiko Becker, Maike Maas, Marc Jose, Sebastian Becking, Valerie Poser</p>		
	</div>
	
	<script>
		$(function(o){
			o = $("#overscroll").overscroll({
				cancelOn: '.no-drag',
				scrollLeft: 200,
				scrollTop: 100
			}).on('overscroll:dragstart overscroll:dragend overscroll:driftstart overscroll:driftend', function(event){
				console.log(event.type);
			});
			$("#link").click(function(){
				if(!o.data("dragging")) {
					console.log("clicked!");
				} else {
					return false;
				}
			});
		});
	</script>
</body>
</html>