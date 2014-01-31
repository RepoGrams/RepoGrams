<?php session_start(); 
require_once("php/language.php");
if (!isset($_SESSION['image']) ) header('location: index.php');?>

<html !DOCTYPE HTML>
<head>
	<?php include('header.php') ?>
</head>

<body>
	<!-- Warning if javascript is disabled -->
	<noscript>
    	<p style="text-align:center; color: white; background-color: red;">
    		<?php print msg('javascript') ?>
    	</p>
	</noscript>
	
	<!-- Menu -->	
	<?php include('menu.php'); ?>
	
	<!-- Content -->
	<div class="container" id="wrap">
		<a href="index.php"><img class="title" title="Repograms" src="img/title.png"></a>
		<br>
    	<div class="hero-unit">
    		<!-- Filtereinstellungen -->
 	   		<form role="form" action="php/filter.php" method="POST" class="form-inline" style="text-align:center;">
 	   			Filter<br>
 	   			<div class="form-group">
    				<select name="filter1" class="form-control">
  						<option value="1"><?php print msg('image-option1-2') ?></option>  
 	 					<option value="0" selected><?php print msg('image-option1-0') ?></option>  
  						<option value="2"><?php print msg('image-option1-3') ?></option>        
	  					<option value="3"><?php print msg('image-option1-4') ?></option>             
					</select>
				</div>
				<!--<div class="form-group">
					<select name="filter2" class="form-control">
  						<option value="0" selected><?php print msg('image-option2-0') ?></option>         
  						<option value="1"><?php print msg('image-option2-1') ?></option>  
 	 					<option value="2"><?php print msg('image-option2-2') ?></option>           
					</select>
				</div>-->
  				<button class="btn btn-default" type="submit" title="Apply filters">
       				<span class="glyphicon glyphicon-indent-left"></span><?php print msg('image-go'); ?>
				</button>
    		</form>
    		
    		<!-- Repo-Visualization -->
    		<!-- Legend -->
    		<div class="color-legend" style="float:left; width: 160px;">
				<div class="legend-title"><?php print msg('image-legend'); ?></div>
					<?php
						require_once('php/functions.php');
						renderLegend();
					?>
			</div>
			
			<!-- Repo-Image -->
			<div class="panel panel-default" style="width:770; display:block; margin:auto auto 0;>
  				<div class="panel-heading">
    				<h3 class="panel-title"><a href="<?php echo $_SESSION['repourl'];?>"><?php echo $_SESSION['title']; ?></a></h3>
  				</div>
  				<div class="panel-body" 
  					style="width:<?php echo $_SESSION['width']+1;?>;boder-style:solid; display:inline-block; 
  						   padding-left: 0 !important; padding-top: 0 !important">
    				<ul style="display:inline-block; list-style-type:none !important; padding-left: 0 !important;">
						<?php
							require_once('php/functions.php');
							renderImage();
						?>
					</ul>
  				</div>
			</div>
			<div class="clear"></div>
			
			<!-- Download image buttons -->
			<div style="float:right;">
				<div class="btn-group">
  					<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">
  						<span class="glyphicon glyphicon-download"></span><?php print msg('image-dl') ?><span class="caret"></span>
  					</button>
  					<ul class="dropdown-menu" role="menu">
    					<li><a href="<?php echo 'download.php?file='.IMAGEDIR.'visualization-'.session_id().'.svg'?>"><?php print msg('image-as') ?> .svg</a></li>
   						<li><a href="<?php echo 'download.php?file='._IMAGEDIR.'visualization-'.session_id().'.png&mode=png'?>"><?php print msg('image-as') ?> .png</a></li>
   						<li><a href="<?php echo 'download.php?file='._IMAGEDIR.'visualization-'.session_id().'.jpg&mode=jpg'?>"><?php print msg('image-as') ?> .jpg</a></li>
  					</ul>
				</div>
			</div>

			<div id="push" class="clear"></div>
			<br><br>
		</div>
	</div>
	
	<?php include('footer.php') ?>

	<script type="text/javascript">
		$(function () {
    		$("[rel='tooltip']").tooltip();
		});
	</script>
	
</body>
</html>
