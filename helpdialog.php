<?php

session_start();
require_once("php/language.php");

?>

<div class="modal fade" id="help" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
 	<div class="modal-dialog wide-modal">
    	<div class="modal-content">
      		<div class="modal-header">
       			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
       			<h3 class="modal-title"><?php print msg('doc-repo-qh');?></h4>
     		</div>
      		<div class="modal-body">
		  <p class="lead">
		    <div class="h4 doc-header "><?php print msg('doc-rg-q');?></div>
			<br>	
			 <?php print msg('doc-rg-a');?>
			<li> <?php print msg('doc-rg-q');?><br>	
				<?php print msg('doc-rg-a');?>
			<li> <?php print msg('doc-chromo-q');?><br>
				<?php print msg('doc-chromo-a');?>
		    <div class="h4 doc-header"><?php print msg('doc-use-q');?></div>
		    <br>
			<?php print msg('doc-use-a1');?> <br>
			<?php print msg('doc-use-a2');?>
			<button class="btn btn-default" title="<?php print msg('index-vis');?>">
       			<span class="glyphicon glyphicon-indent-left"></span><?php print msg('visualize');?>
			</button> <br>
			<?php print msg('doc-use-a3');?>
 
		    <div class="h4 doc-header"><?php print msg('doc-ex');?></div>
			<br>
		</p>
      		</div>
      		<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal"><?php print msg('doc-close');?></button>
      		</div>
    	</div>
  	</div>
</div>
