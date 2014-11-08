var repogramsServices = angular.module('repogramsServices',[]);

repogramsServices.service('reposService', ["$rootScope", "metricSelectionService", function($rootScope, metricSelectionService){
  var RepoArr = [];
  var totalChurnArr = [];
  var mappers = {}; // TODO: support one mapper per metric
  var allMetrics = metricSelectionService.getAllMetrics();
  var maxVal = {};
  for (var i = 0; i < allMetrics.length; i++) {
    // initialize with dummy mapper
    var metric = allMetrics[i].id;
    mappers[metric] = mapperFactory.createMapper(1, metric);
    maxVal[metric] = -1;
  }

  return{
    getRepoArr : function(){
      return RepoArr;
    },
    getTotalChurnArr : function(){
        return totalChurnArr;
    },
  addRepo : function(repoJSON){
    RepoArr.push(repoJSON);
    for (var metric in mappers) {
      //var localMaxVal = Math.max.apply(Math, repoJSON.metricData[metric]);
      var localMaxVal = arrayMax(repoJSON.metricData[metric]);
      if (metric === "branch_usage") {
        //console.assert(false, "Not ready yet");
        mappers[metric] = mapperFactory.createMapper(localMaxVal, metric);
        continue;
      }
      if (localMaxVal > maxVal[metric]) {
        maxVal[metric] = localMaxVal;
        mappers[metric] = mapperFactory.createMapper(localMaxVal, metric);
        $rootScope.$broadcast("mapperChange", metric, mappers[metric]);
      }
    }
    /**
     * totalChurn is necessary to calculate the proportional size of blocks
     * all churns are summed up and stored per repo
     */
    var totalChurn = 0;

    for( var i = 0; i < repoJSON.metricData.churn.length; i++){
    	totalChurn += repoJSON.metricData.churn[i];
    }
    totalChurnArr.push(totalChurn);
  },
  removeRepo : function(place){
    console.assert(place >= 0, "");
    console.assert(place < RepoArr.length, "");
    RepoArr.splice(place,1);
    totalChurnArr.splice(place,1);
    // TODO: recalculate maxvalue
  },
  mapToColor: function(metric, value) {
    console.assert(typeof metric === "string", "metric must be the name of a metric");
    console.assert(typeof mappers[metric] !== "undefined", "mapper is not initialized");
    return mappers[metric].map(value);
  },
  getMapper: function(metric) {
    return mappers[metric];
  }
  };
}]);

repogramsServices.service('metricSelectionService', function() {
  var allMetrics = [
    {id: "commit_modularity", label: "Commit Modularity", description: "A score of the number of unique modules (directories) modified by a commit."},
    {id: "commit_message_length", label: "Commit Message Length", description: "The number of words in a commit log message."},
    {id: "commit_lang_complexity", label: "Commit Language Complexity", description: "The number of unique programming languages used in a commit based on filenames."},
    {id: "branch_usage", label: "Branch Usage", description: "Each branch is associated with a unique color. A commit is colored according to the branch it belongs to."},
    {id: "most_edited_file", label: "Most Edited File", description: "The number of times that the most edited file in a commit has been previously modified."},
    {id: "branch_complexity", label: "Branch Complexity", description: "The number of branches that are concurrently active at a commit point."}
  ];
  var selectedMetrics = [allMetrics[0]];

  return{
    getSelectedMetrics: function() {return selectedMetrics;},
    addMetric: function(metric) {
      if (selectedMetrics.indexOf(metric) === -1) {
        // not in array yet
        selectedMetrics.push(metric);
      }
    },
    removeMetric: function(metric) {
      var position = selectedMetrics.indexOf(metric);
      console.assert(position !== -1, "trying to remove metric which is not contained!");
      selectedMetrics.splice(position, 1);
    },
    getAllMetrics: function() {return allMetrics;},
    clear: function() {selectedMetrics.length = 0;}
  };
});

/**
 * calculates block length for given mode and churn
 */

repogramsServices.service('blenService', function(){
	var getModFunction = {
		"3_constant": function(churn, totalChurn, zoom){return {value: (5), zoom: zoom.num, unit: "px"}},
		"4_fill": function(churn, totalChurn, zoom){return {value:(Math.round(churn*100)/totalChurn), zoom:zoom.num, unit: "%"}}
	};
	var calculateWidth = function(width){
		var widthString = "" + (width.value*width.zoom) + width.unit;
		width.string = widthString;
		return width;
	};
	return{
		getWidth: function(mode, churn, totalChurn, zoom){
			var width = getModFunction[mode](churn, totalChurn, zoom);
			return calculateWidth(width);
			},
		updateString: function(width){
			return calculateWidth(width);
		}
	};
});

repogramsServices.service('blenSelectionService', function() {
	  var allBlenMods = [
	    {id:"3_constant", label: "Fixed width"},
	    {id:"4_fill", label: "Fit to screen"}//,
	    //{id:"5_blanks", label: "Blank Spaces "}
	    
	  ];
	  this.selectedBlenMod = allBlenMods[1];
          var outer = this;

	  return{
	    getSelectedBlenMod: function() {return outer.selectedBlenMod;},
	    setBlenMod: function(blen) {
              outer.selectedBlenMod = blen;
	    },
	    getAllBlenMods: function() {return allBlenMods;}
	  };
});

repogramsServices.service('zoomService', ["$rootScope", function($rootScope) {
	var selectedZoom = { num:1 };
	
	return{
		getSelectedZoom: function() {return selectedZoom;},
		setZoom: function(zoom) {
			$rootScope.$broadcast("zoomChange", zoom);
			selectedZoom = zoom;
		}
	};
}]);

