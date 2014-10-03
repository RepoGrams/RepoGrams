angular.module('repogramsModule').factory('mostEditFile', [function() {
    /*
     * mostEditFile
     * 		for a commit we consider the number of times each file in the commit
     * 		has been modified in all of the previous commits. 
     * 		The metric value is the number of modifications of the file that 
     * 		has been modified the most.
     * 
     * input: 
     * 		inputList 	: list(list(blen,list(str)))
     * 					= list of commits(
     * 							list(
     * 								blen,
     * 								list of changed files(
     * 									complete path to file)))
     * output: 
     * 		outputList 	: list(list(float, int))
     * 					= list(
     * 							list(
     * 								blen,
     * 								number of edits to the most edited file in the commit))
     */

  function mostEditFile(inputList){	
    /*
     * map	: string -> int
     * 		= path to file -> editCount
     */
    var map = {};

    var outputList = [];

    // for c in commit
    for(var i = 0; i < inputList.length; i++){
      max = 0;
      fileList = inputList[i][1];
      blen = inputList[i][0];

      for(var j = 0; j < fileList.length; j++){
        pathToFile = fileList[j];

        if(pathToFile in map){
          map[pathToFile] += 1;
        }
        else{
          map[pathToFile] = 1;
        }

        if(map[pathToFile] > max){
          max = map[pathToFile];
        }
      }
      outputList[i] = max;
    }
    return outputList;
  }

  function test(){
    console.log();
  }
  return {
    "run": mostEditFile
  };
}]);
