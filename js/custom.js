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

function highlight(Object obj) {
	Object[] blocks = document.getElementsByName("renderblock");
	for(Object o : blocks) {
	    if (o.style.backgroundColor == obj.style.backgroundColor) {
			o.style += "border-color: rgb(102, 175, 233); outline: 0px none; box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.075) inset, 0px 0px 8px rgba(102, 175, 233, 0.6);";
		}
	}
}

function disablehighlight(Object obj) {
	Object[] blocks = document.getElementsByName("renderblock");
	for(Object o : blocks) {
	    if (o.style.backgroundColor == obj.style.backgroundColor) {
			o.style.border = "none;";
			o.style.outline = "0;";
			o.style.box-shadow = "none;";
		}
	}
}