function example() {

	    $.ajax({
		    url: 'https://api.github.com/repositories',
	          complete: function(xhr) {
			          var url = xhr.responseJSON;
				url = url[Math.floor(Math.random()*xhr.responseJSON.length)].html_url;

	(document.getElementById('repourl')).value = url+'.git';

				        }
	        });
	      }
