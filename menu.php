<?php 
	
	function makemenu($id = null) {
		$active = array(
				'index' => '',
				'documentation' => '');
		switch ($id) {
			case 0: $active['index'] = 'class="active"'; break;
			case 2: $active['documentation'] = 'class="active"'; break;
		}
		echo '<nav class="navbar navbar-inverse navbar-static-top" role="navigation">
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
						<li><a href="index.php"><img src="img/logo.png"></a></li>
      					<li '.$active['index'].'><a href="index.php">Home</a></li>
      					<li '.$active['documentation'].'><a href="documentation.php">Documentation</a></li>
    				</ul>
  				</div>
		   </nav>';
	}

?>
