<?php
error_reporting(-1);
require_once('./php/utils.php');
startSessionIfNotStarted();
require_once('config.inc.php');
require_once("php/language.php");
if (!isset($_SESSION['image']) ) header('location: index.php');?>

<html !DOCTYPE HTML>
<head>
	<?php include('header.php') ?>
<script type="text/javascript" src="js/d3.v3.min.js"></script>
<script src="http://code.shutterstock.com/rickshaw/vendor/d3.layout.min.js"></script>
<script src="http://code.shutterstock.com/rickshaw/rickshaw.js"></script>

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
		<img class="title" title="Repograms" src="img/title.png" onclick="location.href='index.php'">
		<br>
    	<div class="hero-unit">
    	<!-- Repo-Visualization -->
			<!-- Legend -->
    		<div class="color-legend" style="float:left; width: 160px;">
				<div class="legend-title"><?php print msg('image-legend'); ?></div>
                                <div id="legend">
					<?php
						require_once('php/functions.php');
                                                $legend = "";
						echo renderLegende($legend);
					?>
                                </div>
			</div>
			
			<!-- Repo-Image -->
			<div class="panel panel-default" style="width:770; display:block; margin:auto auto 0;">
  				<div class="panel-heading">
    				<h3 class="panel-title">
    					<a href="<?php echo $_SESSION['repourl'];?>"><?php echo $_SESSION['title'];?></a>
    					&nbsp;
    					<!-- Filtereinstellungen -->
 	   		<form id="filterForm" role="form" class="form-inline" style="text-align:center;">
 	   			Filter
 	   			<div class="form-group">
    				<select id="filter1" name="filter1" class="form-control">
  						<option value="1"><?php print msg('image-option1-1') ?></option>  
 	 					<option value="0" selected><?php print msg('image-option1-0') ?></option>  
  						<option value="2"><?php print msg('image-option1-3') ?></option>        
	  					<option value="3"><?php print msg('image-option1-4') ?></option>             
					</select>
				</div>
    		</form>
    				</h3>
  				</div>
  				<div class="panel-body" style="width:<?php echo $_SESSION['width']+1;?>;boder-style:solid; display:inline-block; padding-left: 0 !important; padding-top: 0 !important;">
    				<ul id="placeOfImage" style="display:inline-block; list-style-type:none !important; padding-left: 0 !important;">
						<?php
							require_once('php/functions.php');
							$img = ""; renderImage($img); echo $img;
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
    					<li><a href="<?php echo 'download.php?file='._IMAGEDIR.'visualization-'.session_id().'.svg'?>"><?php print msg('image-as') ?> .svg</a></li>
   						<li><a href="<?php echo 'download.php?file='._IMAGEDIR.'visualization-'.session_id().'.png&mode=png'?>"><?php print msg('image-as') ?> .png</a></li>
   						<li><a href="<?php echo 'download.php?file='._IMAGEDIR.'visualization-'.session_id().'.jpg&mode=jpg'?>"><?php print msg('image-as') ?> .jpg</a></li>
  					</ul>
				</div>
			</div>

                        <!-- GitHub visualization -->
                        <div id="visu"></div>
			<div id="push" class="clear"></div>
			<br><br>
		</div>
	</div>
	
	<?php include('footer.php') ?>

	<script type="text/javascript">
		$(function () {
                $("[rel='tooltip']").tooltip();
                $("#filterForm").submit(function(event) {
                  event.stopImmediatePropagation(); // stop normal submission
                  event.preventDefault();
                })
                $("#filter1").change(function(event) {
                  if (!$(event.target).is(this))
                  {
                  return;
                  }
                  event.stopImmediatePropagation(); // stop normal submission
                  event.preventDefault();

                  // get the values from the formular
                  var filter_1 = $("#filterForm").find("#filter1 option:selected").val();
                  $("#placeOfImage").fadeToggle();
                  $("#legend").fadeToggle();
                  $("#legend").empty();
                  // send the data
                  jQuery.post("php/filter.php",
                                {
                                  "filter1": filter_1
                                })
                  .done(function(data) {
                    $("#placeOfImage").html(data.image);
                    $("#legend").html(data.legend);
                    $("[rel='tooltip']").tooltip();
                    $("#placeOfImage").fadeToggle();
                    $("#legend").fadeToggle();
                  });
                  return;
                });
                function unixtime2date(unixtime) {
                  // JavaScript's date is base on microseconds, unix time on 
                  // seconds
                  return new Date(unixtime*1000);
                }
                jQuery.post("php/visualization.php")
                  .done(function(initial_data) {
                    var data = jQuery.map(initial_data, function (arr, index) {
                        return {x: parseInt(arr[3]), y: parseInt(arr[1])};
                    });
                    data.sort(function (a,b) {
                        if (a.x < b.x) {
                          return -1;
                        } else if (a.x > b.x) {
                          return 1;
                        } else {
                          return 0;
                        }
                    });

                    var graph = new Rickshaw.Graph( {
                      element: document.querySelector("#visu"),
                        width: $("#placeOfImage").width(),
                        height: 250,
                        renderer: 'line',
                        series: [ {
                          color: 'steelblue',
                          data: data
                        } ]
                    } );

                    var time = new Rickshaw.Fixtures.Time();
                    var tunit = time.unit("seconds");
                    var axes = new Rickshaw.Graph.Axis.Time( {
                      graph: graph,
                      timeUnit: tunit
                    } );

                    graph.render();


                  });
                });               
	</script>
	
</body>
</html>
