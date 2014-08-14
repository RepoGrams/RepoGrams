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
  }
  this.chunkNum = 8;

  var outer = this;

  this.createMapper = function(maxValue, metricName) {
    console.assert(outer.chunkNum > 0, outer.chunkNum);
    var step = Math.floor(maxValue/outer.chunkNum);
    console.assert(step > 0, "negative number!");
    var mName = metricName;
    this.map = function(value) {
       return outer.metric2color[mName][Math.min(outer.chunkNum-1,Math.floor(value/step))];
    }
  }
}

var mf = new MapperFactory();


var repogramsModule = angular.module('repogramsModule',['ngSanitize'])
function getBgColor(blen){
 return '#00ff00';
}

//
//services
//
repogramsModule.service('reposService',
			function(){
				var RepoArr = {};
				var size = 0;
				var pos = 0;

				//TODO: Remove test code!!
				RepoArr[size++] = {
						"name": "Testrepo A",
						"pos": 0,
						"blen": [ 1,1,1,1,1],
						"bmetric": [2,2,2,2,2]
						}
				//TODO: Testcode ends here

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
//						RepoArr[size] = repoJSON;
						RepoArr[size] = {
						"name": "Testrepo A",
						"pos" : pos,
						"blen": [ 1,1,1,1,1],
						"bmetric": [2,2,2,2,2]
						};
						size++;
						},
					removeRepo : function(place){
						var RepoArrNew = {};
						
						for(var i = 0; i < place; i++){
							RepoArrNew[i] = RepoArr[i];
						}
						for(var i  = place; i < size; i++){
							RepoArrNew[i] = RepoArr[i+1];
						}
						size--;
						console.log(RepoArr);
						console.log(RepoArrNew);
						RepoArr = RepoArrNew;

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
		$scope.MetricTitle = "Metric"
		$scope.metrics = [
			{ metricId: 1, name : 'A', link: '#'},
			{ metricId: 2, name : 'B', link: '#'}
		];  
	}
	]);

repogramsModule.controller('RepogramsRender',
	['$scope','reposService',
	function ($scope, reposService){
		$scope.repos = reposService.getRepoArr();
//		$scope.repos = angular.extend('repos',reposService.getRepoArr());
		$scope.removeRepo = function (pos){
				console.log("Delete repo");
				reposService.removeRepo(pos);
		};
	}
	]);

repogramsModule.controller('RepogramsImporter',
	['$scope', 'reposService', function ($scope, reposService){
	$scope.ImportButtonText = "Add";
	$scope.importURL = "git@github.com:mozilla/firefox.git";
	$scope.importRepo = 
	function() {
		if($scope.importURL == "")
			  console.log("Use random repo now!");
		else
			reposService.addRepo({
						"name": "Testrepo A",
						"blen": [ 1,1,1,1,1],
						"bmetric": [2,2,2,2,2]
						});

			console.log("AJAX call to backend now!");
		};
}]);

//
//directives
//
repogramsModule.directive('ngRendermetric', function(){return {
	    restrict: 'E',
	    scope:{
	    },
	    template: '<ul style="list-style:none;" ng-bind-html="metricValues"></ul>',
	    controller: ['$scope','reposService', '$sce', function($scope, reposService, $sce){
		//TODO: Add every metricvalue
		var list = '';
		var repo = reposService.getCurrentRepo();
		for( var i = 0; i < repo.blen.length; i++){
			list += '<li class="customBlock" style="background-color:'+getBgColor(repo.bmetric[i])+'; height:20px; width:'+10*repo.blen[i]+'px; border:1px solid;">';
			list += '</li>'
		}
		$scope.metricValues = $sce.trustAsHtml(list);
	    }]
}});

repogramsModule.directive('ngLegend', function(){ return {
	restrict: 'E',
	scope: {},
	template: '<h3>Legend:</h3><ul style="list-style:none;" ng-bind-html="metricLegend"></ul>',
	controller: ['$scope', '$sce', function($scope, $sce){
                $scope.metricLegend = $sce.trustAsHtml('<li style="background-color:#00ff00; height:10px; width: 10px; border:1px solid;"></li>Description');
	}]
}});
