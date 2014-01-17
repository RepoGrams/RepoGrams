<?php session_start(); 
require_once("php/language.php");
if (!isset($_SESSION['image']) ) header('location: index.php');?>

<html !DOCTYPE HTML>
<head>
	<?php include('header.php')?>
	<meta http-equiv="Content-Type" content="img/svg+xml; charset=UTF-8">
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
    				<label for="filter1">NAME</label>
    				<select id="filter1" name="filter1" class="form-control">
  						<option>OPTION</option>
					</select>
					<label for="filter2">NAME</label>
    				<select id="filter2" name="filter2" class="form-control">
  						<option>OPTION</option>
					</select>
					<label for="filter3">NAME</label>
    				<select id="filter3" name="filter3" class="form-control">
  						<option>OPTION</option>
					</select>
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
			<div class="custom" style="width:<?php echo $_SESSION['width']+1;?>; boder-style:solid; display:inline-block;">
				<ul style="display:inline-block;">
					<?php
						require_once('php/functions.php');
						renderImage();
					?>
				</ul>
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
