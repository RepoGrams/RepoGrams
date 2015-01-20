var repogramsServices = angular.module('repogramsServices', []);

repogramsServices.service('reposService', ["$rootScope", "metricSelectionService", function ($rootScope, metricSelectionService) {
  var RepoArr = [];
  var totalChurnArr = [];
  var mappers = {}; // TODO: support one mapper per metric
  var allMetrics = metricSelectionService.getAllMetrics();
  var maxVal = {};
//  var noOfCommitsArr = [];
  var maxChurn = 0;
  var maxCommits = 0;
  for (var i = 0; i < allMetrics.length; i++) {
    // initialize with dummy mapper
    var metric = allMetrics[i].id;
    mappers[metric] = mapperFactory.createMapper(1, metric);
    maxVal[metric] = -1;
  }

  return {
    getRepoArr: function () {
      return RepoArr;
    },
    getTotalChurnArr: function () {
      return totalChurnArr;
    },
    getMaxChurn: function () {
      return maxChurn;
    },
    addRepo: function (repoJSON) {
      RepoArr.push(repoJSON);
      for (var metric in mappers) {
        //var localMaxVal = Math.max.apply(Math, repoJSON.metricData[metric]);
        var localMaxVal = arrayMax(repoJSON.metricData[metric]);
        if (metric == "branch_usage") {
          mappers[metric] = mapperFactory.createMapper(null, metric);
          $rootScope.$broadcast("mapperChange", metric, mappers[metric]);
        } else if (localMaxVal > maxVal[metric]) {
          maxVal[metric] = localMaxVal;
          mappers[metric] = mapperFactory.createMapper(maxVal[metric], metric);
          $rootScope.$broadcast("mapperChange", metric, mappers[metric]);
        }
      }
      /**
       * totalChurn is necessary to calculate the proportional size of blocks
       * all churns are summed up and stored per repo
       */
      var totalChurn = 0;

      for (var i = 0; i < repoJSON.metricData.churn.length; i++) {
        totalChurn += repoJSON.metricData.churn[i];
      }
      totalChurnArr.push(totalChurn);
      maxChurn = arrayMax(totalChurnArr);
      $rootScope.$broadcast("maxChurnChange", maxChurn);
    },
    removeRepo: function (place) {
      console.assert(place >= 0, "");
      console.assert(place < RepoArr.length, "");
      RepoArr.splice(place, 1);
      var totalChurn = totalChurnArr[place];
      totalChurnArr.splice(place, 1);
      if (totalChurn >= maxChurn) {
        maxChurn = arrayMax(totalChurnArr);
        $rootScope.$broadcast("maxChurnChange", maxChurn);
      }
      // TODO: recalculate maxvalue
    },
    mapToColor: function (metric, value) {
      console.assert(typeof metric === "string", "metric must be the name of a metric");
      console.assert(typeof mappers[metric] !== "undefined", "mapper is not initialized");
      return mappers[metric].map(value);
    },
    getMapper: function (metric) {
      return mappers[metric];
    }
  };
}]);

repogramsServices.service('metricSelectionService', function () {
  var allMetrics = [
    {
      id: "commit_modularity",
      label: "Commit Localization",
      icon: "sun-o",
      description: "Fraction of the number of unique project directories containing files modified by the commit.",
      long_description: "Metric value of 1 means that all the modified files in a commit are in a single directory. Metric value of 0 means <em>all</em> the project directories contain a file modified by the commit."
    },
    {
      id: "commit_message_length",
      label: "Commit Message Length",
      icon: "circle",
      description: "The number of words in a commit log message.",
      long_description: null
    },
    {
      id: "commit_lang_complexity",
      label: "Languages in a Commit",
      icon: "certificate",
      description: "The number of unique programming languages used in a commit based on filenames.",
      long_description: null
    },
    {
      id: "branch_usage",
      label: "Branches Used",
      icon: "plus-circle",
      description: "Each branch is associated with a unique color. A commit is colored according to the branch it belongs to.",
      long_description: null
    },
    {
      id: "most_edited_file",
      label: "Most Edited File",
      icon: "dot-circle-o",
      description: "The number of times that the most edited file in a commit has been previously modified.",
      long_description: null
    },
    {
      id: "branch_complexity",
      label: "Number of Branches",
      icon: "cog",
      description: "The number of branches that are concurrently active at a commit point.",
      long_description: null
    }
  ];
  var selectedMetrics = [allMetrics[0]];

  return {
    getSelectedMetrics: function () {
      return selectedMetrics;
    },
    addMetric: function (metric) {
      if (selectedMetrics.indexOf(metric) === -1) {
        // not in array yet
        selectedMetrics.push(metric);
      }
    },
    removeMetric: function (metric) {
      var position = selectedMetrics.indexOf(metric);
      console.assert(position !== -1, "trying to remove metric which is not contained!");
      selectedMetrics.splice(position, 1);
    },
    getAllMetrics: function () {
      return allMetrics;
    },
    clear: function () {
      selectedMetrics.length = 0;
    }
  };
});

/**
 * calculates block length for given mode and churn
 */

repogramsServices.service('blenService', function () {
  var getModFunction = {
    "1_constant": function (churn, totalChurn, maxChurn, noOfCommits, zoom) {
      return {value: (5), divisor: 1, zoom: zoom.num, unit: "px"}
    },
    "2_churn": function (churn, totalChurn, maxChurn, noOfCommits, zoom) {
      return {value: (churn * 100), divisor: maxChurn, zoom: zoom.num, unit: "%"}
    },
    "3_fill": function (churn, totalChurn, maxChurn, noOfCommits, zoom) {
      return {value: (churn * 100), divisor: totalChurn, zoom: zoom.num, unit: "%"}
    }
  };
  var calculateWidth = function (width) {
    var widthString = "" + ((width.value / width.divisor) * width.zoom) + width.unit;
    width.string = widthString;
    return width;
  };
  return {
    getWidth: function (mode, churn, totalChurn, maxChurn, noOfCommits, zoom) {
      var width = getModFunction[mode](churn, totalChurn, maxChurn, noOfCommits, zoom);
      return calculateWidth(width);
    },
    updateString: function (width) {
      return calculateWidth(width);
    }
  };
});

repogramsServices.service('blenSelectionService', function () {
  var allBlenMods = [
    {
      id: "1_constant",
      label: "Fixed",
      icon: "th",
      description: "All blocks have constant width."
    },
    {
      id: "2_churn",
      label: "Lines changed (comparable btw. projects)",
      icon: "align-left",
      description: "Block width represents number of lines changed in a commit. Project commit histories are scaled <em>uniformly</em> using the same factor (comparable between projects)."
    },
    {
      id: "3_fill",
      label: "Lines changed (incomparable btw. projects)",
      icon: "align-justify",
      description: "Block width represents number of lines changed in a commit. Project commit histories are scaled <em>independently</em> (incomparable between projects)."
    }
  ];
  this.selectedBlenMod = allBlenMods[2];
  var outer = this;

  return {
    getSelectedBlenMod: function () {
      return outer.selectedBlenMod;
    },
    setBlenMod: function (blen) {
      outer.selectedBlenMod = blen;
    },
    getAllBlenMods: function () {
      return allBlenMods;
    }
  };
});

repogramsServices.service('zoomService', ["$rootScope", function ($rootScope) {
  var selectedZoom = {num: 1};

  return {
    getSelectedZoom: function () {
      return selectedZoom;
    },
    setZoom: function (zoom) {
      $rootScope.$broadcast("zoomChange", zoom);
      selectedZoom = zoom;
    }
  };
}]);

repogramsServices.service('scrollService', ["$rootScope", function($rootScope) {
	var selectedScrollPos = { num:0 };
	var currentScrollPos = { num:0 };
	
	return{
		getSelectedScrollPos: function() {return selectedScrollPos;},
		setScrollPos: function(newScrollPos) {
			newPos = newScrollPos.num;
			currPos = currentScrollPos.num;
			scroll = newPos - currPos;
			$rootScope.$broadcast("scrollChange", scroll);
			currentScrollPos = { num:newPos };
		}
	}
}]);

