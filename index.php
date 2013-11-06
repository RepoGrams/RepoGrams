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
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
	
	<!-- Browser fixes -->
	<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
</head>

<body>
	<div class="container" id="wrap">
		<img class="title" src="img/title.png"></a>
		<br><br><br>
    	<div class="hero-unit">
    		<form class="form-inline" role="form" action="php/action.php" method="POST">
    			<legend>Enter the link for your project</legend>
    			<div class="input-group">
    				<input class="form-control" id="projectlink" name="projectlink" type="text" size="143">
     				<span class="input-group-btn">
        				<button class="btn btn-default" type="submit">
        					<span class="glyphicon glyphicon-indent-left"></span>Visualize!
        				</button>
      				</span>
    			</div>
  				<div class="form-group">
  					<input class="checkbox-horizontal" type="checkbox" id="history" name="history" value="true" checked="true">Check for history</input>
				</div>
			</form>
    	</div>
	</div>
	
	<div class="credit">
			<p>&copy;<?php echo date("Y")?> Fabian Kosmale, Heiko Becker, Maike Maas, Marc Jose, Sebastian Becking, Valerie Poser</p>		
	</div>
</body>

</html>