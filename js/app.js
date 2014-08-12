var repogramsModule = angular.module('repogramsModule',[])

//
//services
//
repogramsModule.service('reposService',
			function(){
				var RepoArr = null;
				var size = 0;
				return{
					getRepoArr : function(){
						return RepoArr;
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
	['$scope',
	function ($scope, reposService){
		//TODO: This is the place where the variables need to be stored!
		$scope.repos = [
		{ name:"jQuery",metric: "B"}
		];
	}
	]);

repogramsModule.controller('RepogramsImporter',
	['$scope',function ($scope, reposService){
	$scope.ImportButtonText = "Add";
	$scope.importURL = "";
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
	    restrict: 'A',
	    scope:{
	    },
	    template: '<div class="sparkline"><h4></h4></div>'
		},
	    controller: ['$scope','reposService', function($scope, reposService){}]
});
