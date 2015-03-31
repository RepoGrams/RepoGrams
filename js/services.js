var repogramsServices = angular.module('repogramsServices', []);

repogramsServices.service('reposService', ["$rootScope", function ($rootScope) {
  var RepoArr = [];
  var totalChurnArr = [];
  var maxVal = {};
  var maxChurn = 0;

  // Initialize the maxVal dictionary to zero
  for (var metricId in Metrics) {
    if (Metrics.hasOwnProperty(metricId)) {
      maxVal[metricId] = Number.MIN_VALUE;
    }
  }

  /**
   * Update the max value per metric, if needed.
   */
  var updateMetricMax = function (metricId, newMaxVal, forceUpdate) {
    if (newMaxVal > maxVal[metricId] || forceUpdate) {
      maxVal[metricId] = newMaxVal;

      var mapper = Metrics[metricId].mapper;
      if (mapper.updateMappingInfo(newMaxVal)) {
        $rootScope.$broadcast("mapperChange", metricId, mapper);
      }
    }
  };

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
      $rootScope.$broadcast("reposChange", RepoArr);
      for (var metricId in Metrics) {
        if (Metrics.hasOwnProperty(metricId)) {
          var metricMaxVal = arrayMax(repoJSON.metricData[metricId]);
          updateMetricMax(metricId, metricMaxVal, false);
        }
      }

      /**
       * totalChurn is necessary to calculate the proportional size of blocks
       * all churns are summed up and stored per repo
       */
      var totalChurn = 0;

      for (var i = 0; i < repoJSON.metricData.churns.length; i++) {
        totalChurn += repoJSON.metricData.churns[i];
      }
      totalChurnArr.push(totalChurn);
      maxChurn = arrayMax(totalChurnArr);
      $rootScope.$broadcast("maxChurnChange", maxChurn);
    },
    removeRepo: function (place) {
      console.assert(place >= 0, "");
      console.assert(place < RepoArr.length, "");
      RepoArr.splice(place, 1);
      $rootScope.$broadcast("reposChange", RepoArr);

      var totalChurn = totalChurnArr[place];
      totalChurnArr.splice(place, 1);
      if (totalChurn >= maxChurn) {
        maxChurn = arrayMax(totalChurnArr);
        $rootScope.$broadcast("maxChurnChange", maxChurn);
      }

      for (var metricId in Metrics) {
        if (Metrics.hasOwnProperty(metricId)) {
          var metricMaxVals = [0];
          for (var repoIndex = 0; repoIndex < RepoArr.length; repoIndex++) {
            var repoJSON = RepoArr[repoIndex];
            metricMaxVals.push(arrayMax(repoJSON.metricData[metricId]));
          }
          var metricMaxVal = arrayMax(metricMaxVals);
          updateMetricMax(metricId, metricMaxVal, true);
        }
      }
    },
    moveRepoUp: function (place) {
      if (place == 0)
        return;
      var tmp = RepoArr[place];
      RepoArr[place] = RepoArr[place - 1];
      RepoArr[place - 1] = tmp;
      $rootScope.$broadcast("reposChange", RepoArr);
    },
    moveRepoDown: function (place) {
      if (place == RepoArr.length - 1)
        return;
      var tmp = RepoArr[place];
      RepoArr[place] = RepoArr[place + 1];
      RepoArr[place + 1] = tmp;
      $rootScope.$broadcast("reposChange", RepoArr);
    }
  };
}]);

repogramsServices.service('metricSelectionService', ['$rootScope', function ($rootScope) {
  var selectedMetricIds = [];
  var isMetricsFirst = true;

  return {
    getSelectedMetricIds: function () {
      return selectedMetricIds;
    },
    getSelectedMetricObjects: function () {
      var selectedMetricObjects = {};
      selectedMetricIds.forEach(function (metricId) {
        selectedMetricObjects[metricId] = Metrics[metricId];
      });
      return selectedMetricObjects;
    },
    swapMetric: function (metricId) {
      var position = selectedMetricIds.indexOf(metricId);
      if (position == -1) {
        selectedMetricIds.push(metricId);
      } else {
        selectedMetricIds.splice(position, 1);
      }
      $rootScope.$broadcast('selectedMetricsChange');
    },
    isMetricSelected: function (metricId) {
      return selectedMetricIds.indexOf(metricId) != -1;
    },
    clear: function () {
      for (var i = 0; i < selectedMetricIds.length; i++) {
        Metrics[selectedMetricIds[i]].selected = false;
      }
      selectedMetricIds.length = 0;
      $rootScope.$broadcast('selectedMetricsChange');
    },
    isMetricsFirst: function () {
      return isMetricsFirst;
    },
    setIsMetricsFirst: function (value) {
      isMetricsFirst = value;
      $rootScope.$broadcast('multiMetricModeChange');
    }
  };
}]);

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
    width.string = "" + ((width.value / width.divisor) * width.zoom) + width.unit;
    return width;
  };
  return {
    getWidth: function (mode, churn, totalChurn, maxChurn, noOfCommits, zoom) {
      var width = getModFunction[mode](churn, totalChurn, maxChurn, noOfCommits, zoom);
      return calculateWidth(width);
    }
  };
});

repogramsServices.service('blenSelectionService', ["$rootScope", function ($rootScope) {
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
  this.selectedBlenMod.selected = true;
  var outer = this;

  return {
    getSelectedBlenMod: function () {
      return outer.selectedBlenMod;
    },
    setBlenMod: function (blen) {
      for (var i = 0; i < allBlenMods.length; i++) {
        allBlenMods[i].selected = allBlenMods[i] == blen;
      }
      outer.selectedBlenMod = blen;
      $rootScope.$broadcast('blenModChange');
    },
    getAllBlenMods: function () {
      return allBlenMods;
    }
  };
}]);

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
