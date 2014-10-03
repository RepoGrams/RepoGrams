angular.module('repogramsModule').factory('commitModularity', [function() {
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
   *  Strips filename from path
   *  @precond: path must be a valid Unix path and contain a filename
   *  @returns: the path without the filename
   *  Removes everything after last /
   */
  function getDirPath(path) {
    return path.substr(path.lastIndexOf("/"));
  }

  /*
   * Compute the modularity of a given commit for the list of the files
   */
  function getMetrictCommitModularity(fileList){
    if (fileList.length === 0) {
      return 0; // TODO: in the Github issue, this was the default value; but maybe we should use 1?
    }
    if (fileList.length == 1)
      return 1;
    else{
      var resultContainer = [];
      for (var i = 0; i < fileList.length; i++){
        for (var j = i+1; j < fileList.length; j++){
          var string1 = getDirPath(fileList[i]);
          var string2 = getDirPath(fileList[j]);

          //Windows filenames can't contain a /, check 
          //first if we have unix filepaths
          if (string1.indexOf(UNIXSPLIT) > -1 ||
              string2.indexOf(UNIXSPLIT) > -1){
            string1 = substName(string1, UNIXSPLIT);
          string2 = substName(string2, UNIXSPLIT);
          }else{
            string1 = substName(string1, WINSPLIT);
            string2 = substName(string2, WINSPLIT);
          }
          var res = clj_fuzzy.metrics.jaro_winkler(string1, string2);
          resultContainer.push(res); 
        }
      }
      resultContainer.sort();

      var result = resultContainer[Math.floor(resultContainer.length/2)];
      console.assert(!isNaN(result), "result has to be a number!");

      if (resultContainer.length % 2 === 0){
        result += resultContainer[Math.floor(resultContainer.length/2) +1];
        result /= 2;
      }
      return result;
    }
  }
  return {
    run: getMetrictCommitModularity
  };
}]);
