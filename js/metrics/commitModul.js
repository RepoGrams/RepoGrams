var UNIXSPLIT ="/";
var WINSPLIT = "\\";

function substName(stringToSplit, splitter){
	var result = "";
	var splitted = stringToSplit.split(splitter);

	for(var i = 0; i < splitted.length-1; i++){
		result += splitted[i];
		result += splitter;
	}
}
/*
 * Compute the modularity of a given commit for the list of the files
 */
function getMetrictCommitModularity(fileList){
	if (fileList.length == 1)
		return 1;
	else{
		var resultContainer = [];
		for (var i = 0; i < fileList.length; i++){
			for (var j = i+1; j < fileList.length; j++){
				var string1 = getDirPath(fileList[i]);
				var string2 = getDirPaht(fileList[j]);

				//Windows filenames can't contain a /, check 
				//first if we have unix filepaths
				if (string1.indexOf(UNIXSPLIT) > -1 
					|| string2.indexOf(UNIXSPLIT) > -1){
					string1 = substName(string1, UNIXSPLIT);
					string2 = substName(string2, UNIXSPLIT);
				}else{
					string1 = substName(string1, WINSPLIT);
					string2 = substName(string2, WINSPLIT);
				}
				var res = cij_fuzzy.metrics.Jaro_Winkler(string1, string2);
				resultContainer.push(res); 
			}
		}
		resultContainer.sort();

		var result = resultContainer[Math.floor(resultContainer.length/2)];

		if (resultContainer.length % 2 == 0){
			result += resultContainer[Math.floor(resultContainer.length/2) +1];
			result /= 2;
		}
		return result;
	}
}

