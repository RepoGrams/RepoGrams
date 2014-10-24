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
    {id: "commit_modularity", label: "Commit modularity"},
    {id:"commit_message_length", label: "Commit message length"},
    {id:"commit_lang_complexity", label: "Commit language complexity"},
    {id:"branch_usage", label: "Branch Usage"},
    {id:"most_edit_file", label: "Most edit file"},
    {id:"branch_complexity", label: "Branch complexity"}
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
		"1_churn": function(churn, totalChurn, zoom){return {value: (churn+1), zoom: zoom.num, unit: "px"}},
		"3_constant": function(churn, totalChurn, zoom){return {value: (20) , zoom: zoom.num, unit: "px"}},
		"4_fill": function(churn, totalChurn, zoom){return {value:(Math.round(churn*100)/totalChurn), zoom:1, unit: "%"}}
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
	    {id:"1_churn", label: "Commit size"},
	    {id:"3_constant", label: "Fixed width"},
	    {id:"4_fill", label: "Fit to screen"}//,
	    //{id:"5_blanks", label: "Blank Spaces "}
	    
	  ];
	  this.selectedBlenMod = allBlenMods[2];
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
	}
}]);

