<?php

session_start();
require_once("php/language.php");

?>

<div class="modal fade" id="help" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
 	<div class="modal-dialog wide-modal">
    	<div class="modal-content">
      		<div class="modal-header">
       			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
       			<h3 class="modal-title"><?php print msg('Repograms - Quick Help');?></h4>
     		</div>
      		<div class="modal-body">
		  <p class="lead">
		    <div class="h4 doc-header "><?php print msg('What is Repogram?');?></div>
			<br>	
			 <?php print msg('The word repogram comes from the words "Repository" and "Chromograms"');?>
			<li> <?php print msg('So what is a "Repository"?');?><br>	
				<?php print msg('A repository is a collection of source code files used to develop programs or to manage other files. If you ever used GitHub, you will surely have a so called repository.');?>
			<li> <?php print msg('Ok, clear on that. What is a "Chromogram"?');?><br>
				<?php print msg('A chromogram is an intelligent visualization method. It can display a huge amount of content on a small image. It usually uses blocks.');?>
		    <div class="h4 doc-header"><?php print msg('Read that. So how can I use this site?');?></div>
		    <br>
			<?php print msg('That\'s an easy one.');?> <br>
			<?php print msg('You just need to go to the frontpage, enter the URL of your repository and click on');?>
			<button class="btn btn-default" title="<?php print msg('Visualize the provided repository');?>">
       			<span class="glyphicon glyphicon-indent-left"></span><?php print msg('Visualize!');?>
			</button> <br>
			<?php print msg('After a short waiting time, you will see your rendered chromogram.');?>
 
		    <div class="h4 doc-header"><?php print msg('Do you have some examples?');?></div>
			<br>
		</p>
      		</div>
      		<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal"><?php print msg('Close');?></button>
      		</div>
    	</div>
  	</div>
</div>
