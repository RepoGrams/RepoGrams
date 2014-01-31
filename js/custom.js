function example() {
	$.ajax({
		url: 'https://api.github.com/repositories',
	    complete: function(xhr) {
	    	var url = xhr.responseJSON;
			var number = Math.floor(Math.random()*xhr.responseJSON.length);
			var descr = url[number].description;
			url = url[number].html_url;
			var head = "<div class=\"col-md-offset-4 col-md-4\">";
			head = head + "<div class=\"panel panel-default\">";
			head = head +"<div class=\"panel-heading\">Repository description from GitHub.com:</div>";
			head = head +"<div class=\"panel-body\">";
			descr = head +descr+ "</div></div></div>";
            $("#description").html("<div style=\"text-align:center;\">"+descr+"</div>");
            (document.getElementById('repourl')).value = url+'.git';
		}
	});
}


function highlightBlocks() {
	
}

function unhighlightBlocks() {
	
}