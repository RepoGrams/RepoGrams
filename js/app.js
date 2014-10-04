"use strict";
// TODO: 
// - split file!
// - instead of the watch function, events might make sense
// - currently updating is a bit buggy, can probably be fixed by above

//TODO: move those functions into different file
var MapperFactory = function () {

  this.branch_use_colors =
  [
    "#000000",
    "#ffff00",
    "#1ce6ff",
    "#ff34ff",
    "#ff4a46",
    "#008941",
    "#006fa6",
    "#a30059",
    "#ffdbe5",
    "#7a4900",
    "#0000a6",
    "#63ffac",
    "#b79762",
    "#004d43",
    "#8fb0ff",
    "#997d87",
    "#5a0007",
    "#809693",
    "#feffe6",
    "#1b4400",
    "#4fc601",
    "#3b5dff",
    "#4a3b53",
    "#ff2f80",
    "#61615a",
    // "#ba0900", // used for main branch
    "#6b7900",
    "#00c2a0",
    "#ffaa92",
    "#ff90c9",
    "#b903aa",
    "#d16100",
    "#ddefff",
    "#000035",
    "#7b4f4b",
    "#a1c299",
    "#300018",
    "#0aa6d8",
    "#013349",
    "#00846f",
    "#372101",
    "#ffb500",
    "#c2ffed",
    "#a079bf",
    "#cc0744",
    "#c0b9b2",
    "#c2ff99",
    "#001e09",
    "#00489c",
    "#6f0062",
    "#0cbd66",
    "#eec3ff",
    "#456d75",
    "#b77b68",
    "#7a87a1",
    "#788d66",
    "#885578",
    "#fad09f",
    "#ff8a9a",
    "#d157a0",
    "#bec459",
    "#456648",
    "#0086ed",
    "#886f4c",
    "#34362d",
    "#b4a8bd",
    "#00a6aa",
    "#452c2c",
    "#636375",
    "#a3c8c9",
    "#ff913f",
    "#938a81",
    "#575329",
    "#00fecf",
    "#b05b6f",
    "#8cd0ff",
    "#3b9700",
    "#04f757",
    "#c8a1a1",
    "#1e6e00",
    "#7900d7",
    "#a77500",
    "#6367a9",
    "#a05837",
    "#6b002c",
    "#772600",
    "#d790ff",
    "#9b9700",
    "#549e79",
    "#fff69f",
    "#201625",
    "#72418f",
    "#bc23ff",
    "#99adc0",
    "#3a2465",
    "#922329",
    "#5b4534",
    "#fde8dc",
    "#404e55",
    "#0089a3",
    "#cb7e98",
    "#a4e804",
    "#324e72",
    "#6a3a4c",
    "#83ab58",
    "#001c1e",
    "#d1f7ce",
    "#004b28",
    "#c8d0f6",
    "#a3a489",
    "#806c66",
    "#222800",
    "#bf5650",
    "#e83000",
    "#66796d",
    "#da007c",
    "#ff1a59",
    "#8adbb4",
    "#1e0200",
    "#5b4e51",
    "#c895c5",
    "#320033",
    "#ff6832",
    "#66e1d3",
    "#cfcdac",
    "#d0ac94",
    "#7ed379",
    "#012c58"
  ];

  this.main_branch_color = "#ba0900";

  this.metric2color = {
    "branch_complexity": ["#f7fcfd",
      "#e5f5f9",
      "#ccece6",
      "#99d8c9",
      "#66c2a4",
      "#41ae76",
      "#238b45",
      "#005824"
    ],
    "commit_lang_complexity": ["#f7fcfd",
      "#e0ecf4",
      "#bfd3e6",
      "#9ebcda",
      "#8c96c6",
      "#8c6bb1",
      "#88419d",
      "#6e016b"
    ],
    "commit_message_length": ["#f7fcf0",
      "#e0f3db",
      "#ccebc5",
      "#a8ddb5",
      "#7bccc4",
      "#4eb3d3",
      "#2b8cbe",
      "#08589e"
    ],
    "commit_modularity": ["#fff7ec",
      "#fee8c8",
      "#fdd49e",
      "#fdbb84",
      "#fc8d59",
      "#ef6548",
      "#d7301f",
      "#990000"
    ],
    "most_edit_file": ["#fff7fb",
      "#ece7f2",
      "#d0d1e6",
      "#a6bddb",
      "#74a9cf",
      "#3690c0",
      "#0570b0",
      "#034e7b"
    ]
  };
  this.chunkNum = 8;
  // used to index into branch_use_colors
  this.branch_usage_gauge = 0;

  var outer = this;

  var Mapper = function(maxValue, metricName) {
    console.assert(outer.chunkNum > 0, outer.chunkNum);
    var step = maxValue/outer.chunkNum;
    console.assert(step > 0, "negative number! " + step);
    var mName = metricName;
    this.map = function(value) {
       return outer.metric2color[mName][Math.min(outer.chunkNum-1,Math.floor(value/step))];
    };
    this.getMappingInfo = function() {
      var boundary = 0;
      var mappingInfo = [];
      for (var i = 0; i < outer.chunkNum; i++) {
        mappingInfo.push({
          lowerBound: Math.floor(boundary),
          upperBound: Math.floor(boundary+step),
          color: outer.metric2color[mName][i]
        });
        boundary += step;
      }
      return mappingInfo;
    };
  };

  var BranchUsageMapper = function(maxValue) {
    this.colors = [outer.main_branch_color]; // color for the main branch
    var i = 1; // 0 is already #000000
    while(i < maxValue) {
      outer.branch_usage_gauge = (outer.branch_usage_gauge + 1) % outer.branch_use_colors.length;
      console.assert(outer.branch_use_colors[outer.branch_usage_gauge] !== undefined, "gauge was "+ outer.branch_usage_gauge+ " usable maxvalue: "+ outer.branch_use_colors.length);
      this.colors.push(outer.branch_use_colors[outer.branch_usage_gauge]);
      ++i;
    }
    this.map = function(value) {
      console.assert(this.colors[value-1] !== undefined, "mapping is broken, value was "+value, "number of colors which we can use: "+this.colors.length);
      return this.colors[value-1]; // values start with 1, arrays with 0
    };
    this.getMappingInfo = function() {
      var mappingInfo = [];
      for (var i = 0; i < this.colors.length; i++) {
        mappingInfo.push({
          lowerBound: i,
          upperBound: i,
          color: this.colors[i] 
        });
      }
      return mappingInfo;
    };
  };

  this.createMapper = function(maxValue, metricName) {
    if (metricName === "branch_usage") {
      return new BranchUsageMapper(maxValue);
    } else {
      return new Mapper(maxValue, metricName);
    }
  };
};

var mapperFactory = new MapperFactory();


var repogramsModule = angular.module('repogramsModule',['ui.bootstrap', 'ngAnimate', 'angular-loading-bar']);

function getBgColor(blen){
 return '#00ff00';
}

function arrayMax(arr) {
  var max = arr[0];
  for (var i=0; i < arr.length; i++) {
    max = Math.max(max, arr[i]);
  }
  return  max;
}

//
//services
//
repogramsModule.service('reposService', ["$rootScope", "metricSelectionService", function($rootScope, metricSelectionService){
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

repogramsModule.service('metricSelectionService', function() {
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

repogramsModule.service('blenService', function(){
	var getModFunction = {
			"1_churn": function(churn, totalChurn){return "" + (churn+1) + "px";},
			"3_constant": function(churn, totalChurn){return "20px";},
			"4_fill": function(churn, totalChurn){return "" + (Math.round(churn*100)/totalChurn) + "%";},
	};
	return{
		getWidth: function(mode, churn, totalChurn){
			return getModFunction[mode](churn, totalChurn);
			}
	};
});

repogramsModule.service('blenSelectionService', function() {
	  var allBlenMods = [
	    {id:"1_churn", label: "Churn"},
	    {id:"3_constant", label: "Constant block length"},
	    {id:"4_fill", label: "Proportional to horizontal space"}//,
	    //{id:"5_blanks", label: "Blank Spaces "}
	    
	  ];
	  this.selectedBlenMod = allBlenMods[0];
          var outer = this;

	  return{
	    getSelectedBlenMod: function() {return outer.selectedBlenMod;},
	    setBlenMod: function(blen) {
              outer.selectedBlenMod = blen;
	    },
	    getAllBlenMods: function() {return allBlenMods;}
	  };
});


//
//controllers
//
repogramsModule.controller('RepogramsConfig',
	['$scope', 'metricSelectionService', 'blenSelectionService',
	function ($scope, metricSelectionService, blenSelectionService){
		//default metric is 1
		$scope.metricService = metricSelectionService;
		$scope.metrics = $scope.metricService.getAllMetrics();
		$scope.currentMetric = $scope.metrics[0];
        $scope.selectAction = function() {
        	$scope.metricService.clear();
        	$scope.metricService.addMetric($scope.currentMetric);
        };
        $scope.blenService = blenSelectionService;
		$scope.blenMods = $scope.blenService.getAllBlenMods();
                $scope.currentBlen = $scope.blenService.getSelectedBlenMod();
        $scope.selectBlenAction = function() {
        	$scope.blenService.setBlenMod($scope.currentBlen);
        };
	}
	]);

repogramsModule.controller('RepogramsRender',
	['$scope','reposService',
	function ($scope, reposService){
		$scope.repos = reposService.getRepoArr();
		$scope.removeRepo = function (pos){
				reposService.removeRepo(pos);
		};
	}
	]);

repogramsModule.controller('RepogramsImporter',
	['$scope', '$http', 'reposService', 'metricsRunner', function ($scope, $http, reposService, metricsRunner){
	$scope.ImportButtonText = "Add";
	$scope.importURL = "https://github.com/Inkane/chakra-paste.git";
        $scope.errors = [] ;
        $scope.closeAlert = function(index) {
          $scope.errors.splice(index, 1);
        };
	$scope.importRepo = function() {
          // TODO: get random URL
                  var url = ($scope.importURL === "") ? "https://github.com/Inkane/chakra-paste.git" : $scope.importURL;
          console.log("fetch " + url);
          var result = $http.post(
             "/getGitData",
             {"repourl": url}
          );
          result.success(function(data) {
            reposService.addRepo({
              "name": $scope.importURL.split("/").pop(),
              "metricData": metricsRunner.runMetrics(data),
            });
          });
          result.error(function(data) {
            console.log(data);
            $scope.errors.push(data);
          });
        }
}]);

//
//directives
//

repogramsModule.directive('ngRenderblock', function(){
        return {
          restrict: 'E',
          scope: {
                commitMsg: "@commitMsg",
                bgColor: "@color",
                width: "=width"
          },
  template: '<div class="customBlock" popover="{{commitMsg}}" popover-trigger="mouseenter" style="background-color: {{bgColor}}; height:20px; width: {{width}}; outline:1px solid black;"></div>'
        };
});


repogramsModule.directive('ngRendermetric', function(){
        return {
	    restrict: 'E',
	    scope:{},
	    template: '<div ng-repeat="metric in selectedMetrics"><div style="width:100%; overflow: auto; white-space: nowrap;">' +
	    '<div style="width:100%; padding: 1px; overflow: visible; white-space: nowrap;">' +
	    '<ng-renderblock ng-repeat="style in styles[metric.id][blenMod().id]"  commit-msg={{repo.metricData.commit_msgs[$index]}} color={{style.color}} width=style.width></ng-renderblock>' +
  '</div></div>',
	    controller: ['$scope','reposService', 'blenService', 'metricSelectionService', 'blenSelectionService', function($scope, reposService, blenService, metricSelectionService, blenSelectionService, $sce){
		//TODO: Add every metricvalue
                $scope.reposService = reposService;
                $scope.blenService = blenService;
                $scope.metricSelectionService = metricSelectionService;
                $scope.blenSelectionService = blenSelectionService;
                $scope.selectedMetrics = metricSelectionService.getSelectedMetrics();
                $scope.repo = reposService.getRepoArr()[$scope.$parent.$index];
                $scope.blenMod = blenSelectionService.getSelectedBlenMod;
                $scope.totalChurn = reposService.getTotalChurnArr()[$scope.$parent.$index];
                $scope.styles = {};
                angular.forEach(metricSelectionService.getAllMetrics(), function(value, key) {
                	$scope.styles[value.id] = [];
                	var currentValueIDStyle = $scope.styles[value.id];

                	angular.forEach(blenSelectionService.getAllBlenMods(), function(bValue, bKey) {
                		currentValueIDStyle[bValue.id] = [];
                		var currentModIDStyle = currentValueIDStyle[bValue.id];
                		
	                	for( var i = 0; i < $scope.repo.metricData[value.id].length; i++){
	                		var churn = $scope.repo.metricData.churn[i];
	                		var x = {
	                				color: reposService.mapToColor(value.id, $scope.repo.metricData[value.id][i]),
	                				width: (blenService.getWidth(bValue.id, churn, $scope.totalChurn))
	                		};
	                		currentModIDStyle.push(x);
	                	}
                	});
                });
                // the mapper might change when a new repo is added, and the
                // maxvalue increases
                $scope.$on('mapperChange', function (evnt, metricID, newMapper) {
                	angular.forEach(blenSelectionService.getAllBlenMods(), function(bValue, bKey) {
                		
                		for( var i = 0; i < $scope.repo.metricData[metricID].length; i++){
                			$scope.styles[metricID][bValue.id][i].color = newMapper.map($scope.repo.metricData[metricID][i]);
                		}
                	});
                });
            }]
};});

repogramsModule.directive('ngLegend', function(){ return {
	restrict: 'E',
	scope: {},
	template: '<div class="panel panel-success">' +
		  '<div class="panel-heading">'+
		  '<h3 class="panel-title">Legend</h3>'+
		  '</div>' +
                  '<div ng-repeat="metric in selectedMetrics"><h4>{{metric.label}}</h4><ul>' +
                  '<li ng-repeat="style in styles[metric.id]">{{style.lowerBound}}-{{style.upperBound}}: <span class="customBlock" style="background-color: {{style.color}}; height:20px; width: {{style.width}}; border:1px solid;"></span></li>' +
                  '</ul></div></div>',
	controller: ['$scope', 'reposService', 'metricSelectionService', function($scope, reposService, metricSelectionService){
          $scope.reposService = reposService;
          $scope.metricSelectionService = metricSelectionService;
          $scope.selectedMetrics = metricSelectionService.getSelectedMetrics();
          $scope.styles = {};
          angular.forEach(metricSelectionService.getAllMetrics(), function(value, index) {
            $scope.styles[value.id] = [];
          });

          $scope.$on("mapperChange", function(evnt, metricID, newMapper) {
            console.assert(angular.isDefined(newMapper), "new mapper is not defined!");
            var mappingInfo = newMapper.getMappingInfo();
            for (var i=0; i < mappingInfo.length; i++) {
              $scope.styles[metricID][i] = {
                color: mappingInfo[i].color,
            width: "10px",
            lowerBound: mappingInfo[i].lowerBound,
            upperBound: mappingInfo[i].upperBound
              };
            }
          }, true);
	}]
};});
