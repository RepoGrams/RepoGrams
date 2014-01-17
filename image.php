<?php session_start(); 
require_once("php/language.php");
if (!isset($_SESSION['image']) ) header('location: index.php');?>

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
    	<div class="hero-unit">
    		<div>
    			<!-- Filtereinstellungen -->
    			<form class="form-inline" role="form">
    				<div class="form-group"> 
    					<label for="filter1">Commit</label>
    					<select id="filter1" name="filter1" class="form-control">
  							<option>Autor</option>              <!-- 2 -->
  							<option>Commmitmessage</option>     <!-- 1 -->
  							<option>First 3 letters</option>    <!-- 0 -->
  							<option>Time</option>               <!-- 3 -->
	  						<option>Date</option>               <!-- 4 -->
						</select>
						<label for="filter2">Operation</label>
    					<select id="filter2" name="filter2" class="form-control">
  							<option>Add</option>                <!-- 1 -->
  							<option>Delete</option>             <!-- 2 -->
						</select>
					</div>
    			</form>
    		</div>
    		
    		<!-- Repo-Visualization -->
    		<!-- Legend -->
    		<div class="color-legend">
				<div class="legend-title"><?php print msg('Legend'); ?></div>
					<div class="legend-scale">
  						<ul class="legend-labels">
  							<?php 
								if (isset($_GET['legend'])) {
									foreach ($_GET['legend'] as $entry) {
										echo '<li><span style="background:rgb('.$entry['c'].');"></span>'.$entry['t'].'</li>';
									}
		               			}
		            		?>
  						</ul>
					</div>
			</div>
			<!-- Repo-Image -->
			<script type="text/javascript" src="js/jquery.overscroll.min.js"></script>
			<div class="container" style="width:<?php echo $_SESSION['width']+1;?>; boder-style:solid;">
				<ul>
					<?php
						require_once('php/functions.php');
						renderImage();
					?>
				</ul>
			</div>
			<div style="float:right;">
				<div class="btn-group">
  					<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">
  						<span class="glyphicon glyphicon-download"></span> Download image <span class="caret"></span>
  					</button>
  					<ul class="dropdown-menu" role="menu">
    					<li><a href="<?php echo 'visualization-'.session_id().'.svg'; ?>">as .svg</a></li>
   						<li><a href="<?php $image = new Imagick();
										   $image->readImageBlob(file_get_contents('visualization-'.session_id().'.svg'));
										   $image->setImageFormat("png24");
 										   $image->resizeImage($_SESSION["width"]*2, $_SESSION["height"]*2, imagick::FILTER_LANCZOS, 1); 
										   $image->writeImage('visualization-'.session_id().'.png');
										   echo 'visualization-'.session_id().'.png'; ?>">
									as .png</a></li>
   						<li><a href="<?php $image = new Imagick();
										   $image->readImageBlob(file_get_contents('visualization-'.session_id().'.svg'));
										   $image->setImageFormat("jpg");
 										   $image->resizeImage($_SESSION["width"]*2, $_SESSION["height"]*2, imagick::FILTER_LANCZOS, 1); 
										   $image->writeImage('visualization-'.session_id().'.jpg');
										   echo 'visualization-'.session_id().'.png'; ?>">
									as .jpg</a></li>
  					</ul>
				</div>
			</div>
			<div id="push" class="clear"></div>
			<br><br>
		</div>
	</div>
	
	<?php include('footer.php')?>

</body>
</html>
<?php
require_once('php/functions.php');
	initSession(false);
?>
