var repogramsModule = angular.module('repogramsModule',[])

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
	function ($scope){
		//TODO: This is the place where the variables need to be stored!
		$scope.repos = [
		{ name:"jQuery",metric: "B"}
		];
	}
	]);

repogramsModule.controller('RepogramsImporter',
	['$scope',function ($scope){
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
		}
});
