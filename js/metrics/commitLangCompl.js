/*
 * Small hack to get a fitting map function as the map function is an extension
 * of the javaScript standard and not implemented in every version.
 */
if (!Array.prototype.map)
{
	Array.prototype.map = function(fun /*, thisp*/)
	{
		var len = this.length;
		if (typeof fun != "function")
			throw new TypeError();

		var res = new Array(len);
		var thisp = arguments[1];
		for (var i = 0; i < len; i++)
		{
			if (i in this)
				res[i] = fun.call(thisp, this[i], i, this);
		}

		return res;
	};
}

/*
 * Function that validates if a given file extension is in the set of wanted 
 * extensions, that has been specified by Ivan.
 */
function isValidEnding(entry, JSONvalues){
	return jQuery.inArray(entry, JSONvalues.ENDINGS) != -1;
}

function isValidFile(entry, JSONvalues){
	return jQuery.inArray(entry, JSONvalues.NAMES) != -1;
}


/*
 * Return for a list of changed files an integer containing the number of 
 * changed files.
 */
function getMetric(fileList) {
	var mem = new Object();	

	var result = jQuery.get("js/metrics/filenames.json", function(data){
		var JSONvalues = jQuery.parseJSON(data);
		
		fileList.forEach(function (entry){
			if(isValidFile(entry, JSONValues)){
				entry in mem? mem[entry] +=1 : mem[entry] = 1;
                        }
			else {
				"Other" in mem ? mem["Other"] += 1: mem[entry] = 1;
			}
		});

		var array = fileList.map(function(obj){
		var all = obj.split();
		return all[all.length-1];
                });

                array.forEach(function (entry){
                  if(isValidEnding(entry, JSONValues)){
                    entry in mem ? mem[entry] += 1 : mem[entry] = 1;
                  } else {
                    "Other" in mem ? mem["Other"] +=1 : mem[entry] = 1;
                  }
                });
		
	}
	);
	var max = 0;
	var Mkey = null;
	for (var key in mem){
		var val = mem[key];
		if (val > max){
			max = val;
			Mkey = key;
		}
	}
	return max;
	}
