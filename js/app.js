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
    console.log("maxValue is" + maxValue);
    var step = Math.floor(maxValue/outer.chunkNum);
    console.assert(step > 0, "negative number! " + step);
    var mName = metricName;
    this.map = function(value) {
       return outer.metric2color[mName][Math.min(outer.chunkNum-1,Math.floor(value/step))];
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
				var size = 0;
				var pos = 0;

				return{
					getRepoArr : function(){
						return RepoArr;
					},
					getCurrentRepo : function(){
						return RepoArr[pos];
					},
					getCurrentPos : function(){
						return pos;
					},
					advance : function(){
						if(pos < size){
							pos++;
							return true;
						}else
							return false;
					},
					reset : function(){
						pos = 0;
						return 0;
					},
					addRepo : function(repoJSON){
                                                console.log(repoJSON);
						RepoArr[size] = repoJSON;
						size++;
						},
					removeRepo : function(place){
                                                RepoArr.splice(place,1);
						size--;
						console.log(RepoArr);
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
				console.log("Delete repo");
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
        // TODO: maxval and mapper ought to move into the service -- this also
        // enables us to 
        var maxval = 0;

        return {
	    restrict: 'E',
	    scope:{},
	    template: '<ul style="list-style:none;">' + 
'<li ng-repeat="style in styles" class="customBlock" style="background-color: {{style.color}}; height:20px; width: {{style.width}}; border:1px solid;"></li>' +
  '</ul>',
	    controller: ['$scope','reposService', '$sce', function($scope, reposService, $sce){
		//TODO: Add every metricvalue
		var repo = reposService.getRepoArr()[$scope.$parent.$index];
                // TODO: replace hardcoded metric with selected one
                maxval = Math.max(maxval, Math.max.apply(Math, repo.metricData.msgLengthData));
                $scope.styles = [];
                var mapper = mapperFactory.createMapper(maxval, "commit_message_length");
		for( var i = 0; i < repo.metricData.msgLengthData.length; i++){
                  $scope.styles.push({
                    color: mapper.map(repo.metricData.msgLengthData[i]),
                    width: "10px"
                  });
		}
	    }]
};});

repogramsModule.directive('ngLegend', function(){ return {
	restrict: 'E',
	scope: {},
	template: '<h3>Legend:</h3><ul style="list-style:none;" ng-bind-html="metricLegend"></ul>',
	controller: ['$scope', '$sce', function($scope, $sce){
                $scope.metricLegend = $sce.trustAsHtml('<li style="background-color:#00ff00; height:10px; width: 10px; border:1px solid;"></li>Description');
	}]
};});
