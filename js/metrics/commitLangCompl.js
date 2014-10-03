angular.module('repogramsModule').factory('commitLangCompl', ['fileInfo', function(fileInfo) {
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
      return entry.indexOf(fileInfo.ENDINGS) != -1;
    }

    function isValidFile(entry){
      return entry.indexOf(fileInfo.NAMES) != -1;
    }


    /*
     * Return for a list of changed files an integer containing the number of 
     * changed files.
     */
    function getMetric(fileList, data) {
      var mem = {};	

      fileList.forEach(function (entry){
        var recognized = isValidFile(entry = entry.split("/").pop()) ||
          /*assign everything after last . to entry and check if it's a valid
           * extension*/
          (isValidEnding(entry = entry.split(".").pop()));
        if(recognized) {
          entry in mem? mem[entry] +=1 : mem[entry] = 1;
        } else {
          "Other" in mem ? mem["Other"] += 1: mem["Other"] = 1;
        }
      });
      return Object.keys(mem).length;
      }

      return {
        "run": getMetric
      };
}]);
