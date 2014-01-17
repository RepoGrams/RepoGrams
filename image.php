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
    		<script type="text/javascript" src="js/jquery.overscroll.min.js"></script>
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
			<div class="container" style="width:<?php echo $_SESSION['width']+1;?>; boder-style:solid;">
				<ul>
			<?php
			require_once('php/functions.php');
			renderImage();
?>
				</ul>
			</div>
			<div class="clear"></div>
			<br><br>
    		<div id="push"></div>
		</div>
	</div>
	
	<?php include('footer.php')?>

</body>
</html>
<?php
require_once('php/functions.php');
	initSession(false);
?>
