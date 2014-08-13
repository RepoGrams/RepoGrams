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
						RepoArr[size] = repoJSON;
						size++;
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
	}
	]);

repogramsModule.controller('RepogramsImporter',
	['$scope',function ($scope, reposService){
	$scope.ImportButtonText = "Add";
	$scope.importURL = "git@github.com:mozilla/firefox.git";
	$scope.importRepo = 
	function() {
		if($scope.importURL == "")
			  console.log("Use random repo now!");
		else
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
//		$scope.metricValues = $sce.trustAsHtml('<li class="customBlock" style="background-color:rgb(0,255,0); height:30px; width:20px; border:1px solid;"></li>\
//		<li class="customBlock" style="background-color:rgb(255,0,0); height:30px; width:60px; border:1px solid;"></li>\
//		<li class="customBlock" style="background-color:rgb(0,0,255); height:30px; width:40px; border:1px solid;"></li>');
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
