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

//
//services
//
repogramsModule.service('reposService',
			function(){
				var RepoArr = [];
                                var mapper; // TODO: support one mapper per metric
                                var maxVal = 0;

				return{
					getRepoArr : function(){
						return RepoArr;
					},
					addRepo : function(repoJSON){
						RepoArr.push(repoJSON);
                                                var localMaxVal = Math.max.apply(Math, repoJSON.metricData.msgLengthData); // TODO: support all metrics
                                                if (localMaxVal > maxVal) {
                                                  maxVal = localMaxVal;
                                                  this.mapper = mapperFactory.createMapper(maxVal, "commit_message_length");
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
                                          console.assert(typeof this.mapper !== "undefined", "mapper is not initialized");
                                          return this.mapper.map(value);
                                        },
                                        getMapper: function() {
                                          return mapper;
                                        }
				};
			});

//
//controllers
//
repogramsModule.controller('RepogramsConfig',
	['$scope',
	function ($scope){
		//default metric is 1
		$scope.metricId = 1;
		$scope.MetricTitle = "Metric";
		$scope.metrics = [
			{ metricId: 1, name : 'Metric A', link: '#'},
			{ metricId: 2, name : 'Metric B', link: '#'}
		];  
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
              "blen": [ 1,2,1,5,1,3,2],
              "bmetric": [33,0,20,35,40,10,11]
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
	    template: '<div style="width:auto">' +
'<div ng-repeat="style in styles" class="customBlock" style="background-color: {{style.color}}; height:20px; width: {{style.width}}; border:1px solid;"></div>' +
  '</div>',
	    controller: ['$scope','reposService', '$sce', function($scope, reposService, $sce){
		//TODO: Add every metricvalue
                $scope.reposService = reposService;
		$scope.repo = reposService.getRepoArr()[$scope.$parent.$index];
                // TODO: replace hardcoded metric with selected one
                // add the mapper to the scope, so we can watch for changes,
                // upon which we need to recalculate the colour
                $scope.styles = [];
		for( var i = 0; i < $scope.repo.metricData.msgLengthData.length; i++){
                  $scope.styles.push({
                    color: reposService.mapToColor("commit_message_length", $scope.repo.metricData.msgLengthData[i]),
                    width: "10px"
                  });
		}
                $scope.$watch('reposService.mapper', function (newVal, oldVal, scope) {
                  if (newVal !== undefined) {
                    for (var i = 0; i < scope.styles.length; i++) {
                      scope.styles[i].color = newVal.map(scope.repo.metricData.msgLengthData[i]);
                    }
                  } 
                });
	    }]
};});

repogramsModule.directive('ngLegend', function(){ return {
	restrict: 'E',
	scope: {},
  //TODO: The legend looks funny, but at least it seems to work
	template: '<h3>Legend:</h3>' +
                  '<ul>' +
                  '<li ng-repeat="style in styles">{{style.lowerBound}}-{{style.upperBound}}: <span class="customBlock" style="background-color: {{style.color}}; height:20px; width: {{style.width}}; border:1px solid;"></span></li>' +
                  '</ul>',
	controller: ['$scope', 'reposService', function($scope, reposService){
          $scope.reposService = reposService;
          $scope.styles = [];
          $scope.$watch('reposService.mapper', function (newVal, oldVal, scope) {
            if (newVal !== undefined) {
              var mappingInfo = newVal.getMappingInfo();
              console.log(mappingInfo);
              for (var i=0; i < mappingInfo.length; i++) {
                $scope.styles[i] = {
                  color: mappingInfo[i].color,
                  width: "10px",
                  lowerBound: mappingInfo[i].lowerBound,
                  upperBound: mappingInfo[i].upperBound
                };
              }
            }
          });
	}]
};});
