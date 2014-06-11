function isValidEnding(entry){
	return true;
}

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
