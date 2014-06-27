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
function isValidEnding(entry){
	return true;
}


/*
 * Return for a list of changed files an integer containing the number of 
 * changed files.
 */
function getMetric(fileList) {

	//First get a list of file extensions
	var array = fileList.map(function(obj){
		var all = obj.split();
		return all[all.length-1];
		);

	var mem = new Object();

	array.forEach(function (entry){
		if(isValidEnding(entry)){
			entry in mem ? mem[entry] += 1 : mem[entry] = 1;
		}else
		"Other" in mem ? mem["Other"] +=1 : mem[entry] = 1;
	}
	);

	return mem;
	}
