<?php
session_start();
require_once("php/language.php");
?>

/*
 * function to display a random example on the index.php page
 */
function example() {
	//make ajax call tp github api
	$.ajax({
		url: 'https://api.github.com/repositories',
		//complte handler
	    complete: function(xhr) {    
		//take the response into a variable
	    	var url = xhr.responseJSON;
		//compute a random number
		var number = Math.floor(Math.random()*xhr.responseJSON.length);
		//get the description for the object
		var descr = url[number].description;
		//Get the gitHub url
		url = url[number].html_url;
		//combine the html object
		var head = "<div class=\"col-md-offset-4 col-md-4\">";
		head = head + "<div class=\"panel panel-default\">";
		head = head +"<div class=\"panel-heading\"><?php print msg ('Repository description from')?> GitHub.com:</div>";
		head = head +"<div class=\"panel-body\">";
		descr = head +descr+ "</div></div></div>";
            $("#description").html("<div style=\"text-align:center;\">"+descr+"</div>");
	    //add the element to the document
            (document.getElementById('repourl')).value = url+'.git';
		}
	});
}


function highlightBlocks() {
	
}

function unhighlightBlocks() {
	
}
