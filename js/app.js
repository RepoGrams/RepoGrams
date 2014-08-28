// TODO: 
// - split file!
// - instead of the watch function, events might make sense
// - currently updating is a bit buggy, can probably be fixed by above

//TODO: move those functions into different file
var MapperFactory = function () {

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

  this.createMapper = function(maxValue, metricName) {
    return new Mapper(maxValue, metricName);
  };
};

var mapperFactory = new MapperFactory();


var repogramsModule = angular.module('repogramsModule',['ngSanitize']);

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
  addRepo : function(repoJSON){
    RepoArr.push(repoJSON);
    for (var metric in mappers) {
      //var localMaxVal = Math.max.apply(Math, repoJSON.metricData[metric]);
      var localMaxVal = arrayMax(repoJSON.metricData[metric]);
      if (localMaxVal > maxVal[metric]) {
        maxVal[metric] = localMaxVal;
        mappers[metric] = mapperFactory.createMapper(localMaxVal, metric);
        $rootScope.$broadcast("mapperChange", metric, mappers[metric]);
      }
    }
  },
  removeRepo : function(place){
    console.assert(place >= 0, "");
    console.assert(place < RepoArr.length, "");
    RepoArr.splice(place,1);
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

//
//controllers
//
repogramsModule.controller('RepogramsConfig',
	['$scope', 'metricSelectionService',
	function ($scope, metricSelectionService){
		//default metric is 1
                $scope.metricService = metricSelectionService;
		$scope.metrics = $scope.metricService.getAllMetrics();
		$scope.currentMetric = $scope.metrics[0];
                $scope.selectAction = function() {
                  $scope.metricService.clear();
                  $scope.metricService.addMetric($scope.currentMetric);
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
	['$scope', '$http', 'reposService', function ($scope, $http, reposService){
	$scope.ImportButtonText = "Add";
	$scope.importURL = "https://github.com/Inkane/chakra-paste.git";
	$scope.importRepo = 
	function() {
          // TODO: get random URL
                  var url = ($scope.importURL === "") ? "https://github.com/Inkane/chakra-paste.git" : $scope.importURL;
          console.log("fetch " + url);
          var result = $http.post(
             "php/data.php",
             {"repourl": url}
          );
          result.success(function(data) {
            reposService.addRepo({
              "name": $scope.importURL.split("/").pop(),
              "metricData": runMetrics(data),
            });
          });
        };
}]);

//
//directives
//
repogramsModule.directive('ngRendermetric', function(){

        return {
	    restrict: 'E',
	    scope:{},
	    template: '<div ng-repeat="metric in selectedMetrics"><div style="width:auto; overflow: auto; white-space: nowrap;">' +
'<div ng-repeat="style in styles[metric.id]" class="customBlock" style="background-color: {{style.color}}; height:20px; width: {{style.width}}; border:1px solid;"></div>' +
  '</div></div>',
	    controller: ['$scope','reposService', 'metricSelectionService', function($scope, reposService, metricSelectionService, $sce){
		//TODO: Add every metricvalue
                $scope.reposService = reposService;
                $scope.metricSelectionService = metricSelectionService;
                $scope.selectedMetrics = metricSelectionService.getSelectedMetrics();
		$scope.repo = reposService.getRepoArr()[$scope.$parent.$index];
                $scope.styles = {};
                angular.forEach(metricSelectionService.getAllMetrics(), function(value, index) {
                  $scope.styles[value.id] = [];

                  for( var i = 0; i < $scope.repo.metricData[value.id].length; i++){
                    var x = {
                      color: reposService.mapToColor(value.id, $scope.repo.metricData[value.id][i]),
                      width: "" + ($scope.repo.metricData.defaultBlen[i]+1) + "px" 
                    };
                    $scope.styles[value.id].push(x);
                  }

                });
                // the mapper might change when a new repo is added, and the
                // maxvalue increases
                $scope.$on('mapperChange', function (evnt, metricID, newMapper) {
                  for( var i = 0; i < $scope.repo.metricData[metricID].length; i++){
                    $scope.styles[metricID][i].color = newMapper.map($scope.repo.metricData[metricID][i]);
                  }
                });
            }]
};});

repogramsModule.directive('ngLegend', function(){ return {
	restrict: 'E',
	scope: {},
  //TODO: The legend looks funny, but at least it seems to work
	template: '<h3>Legend:</h3>' +
                  '<div ng-repeat="metric in selectedMetrics"><h4>{{metric.label}}</h4><ul>' +
                  '<li ng-repeat="style in styles[metric.id]">{{style.lowerBound}}-{{style.upperBound}}: <span class="customBlock" style="background-color: {{style.color}}; height:20px; width: {{style.width}}; border:1px solid;"></span></li>' +
                  '</ul></div>',
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
