<?php session_start();?>

<html !DOCTYPE HTML>
<head>
	<?php include('header.php')?>
</head>

<body>
	<!-- Menu -->	
	<?php include('menu.php'); makemenu(null);?>
	
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
		               			}
		            		?>
  						</ul>
					</div>
			</div>
			<div class="panel panel-default" style="overflow: hidden; height: 555px; width: 75%; margin: auto auto 0;">
  				<div class="panel-heading"><?php //if (isset($_GET['title'])) echo $_GET['title'];?></div>
				<div id="overscroll"> 
					<ul><li><img src="php/visualization.png"></li></ul>
<!-- 					<ul> -->
					<!-- width,height,tile.width,tile.height,tile.color -->
						<?php 
// 							if (isset($_SESSION['image'])) {
// 								foreach ($_SESSION['image'] as $row) {
// 									foreach ($row as $tile) {
// 										echo '<li style="background-color: rgb('.$tile['3'].');width:'.$tile['0'].';height:'.$tile['1'].'"></li>';
// 									}
// 								}
// 		                	}
// 		            	?>
<!-- 					</ul> -->
				</div>
			</div>
    		<div id="push"></div>
		</div>
	</div>
	
	<?php include('footer.php')?>

	<script>
    	$(function () {
        	$("[rel='tooltip']").tooltip();
    	});
	
		$(function(o){
			o = $("#overscroll").overscroll({
				cancelOn: '.no-drag',
				scrollLeft: 200,
				scrollTop: 100
			}).on('overscroll:dragstart overscroll:dragend overscroll:driftstart overscroll:driftend', function(event){
				console.log(event.type);
			});
			$(nr).click(function(){
				if(!o.data("dragging")) {
					document.getElementById(nr).innerHTML = '<a href="" data-title="'
						+<?php if (isset($_GET['infos'])) { echo $_GET['infos'][nr];}?>
						+'" data-placement="right" rel="tooltip"></a>';
				} else {
					return false;
				}
			});
		});
	</script>
</body>
</html>
