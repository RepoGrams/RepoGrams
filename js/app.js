function RepogramsConfig($scope){
	//default metric is 1
	$scope.metricId = 1;
	$scope.MetricTitle = "Metric"
	$scope.metrics = [
		{ metricId: 1, name : 'A', link: '#'},
		{ metricId: 2, name : 'B', link: '#'}
	];
			  
};

function RepogramsRender($scope){
	$scope.repos = [
		{ name:"jQuery",metric: "B"}
			  ];
};

function RepogramsImporter($scope){
	$scope.ImportButtonText = "Add";
	$scope.importURL = "";
	$scope.importRepo = 
		function() {
			if($scope.importURL == "")
					  console.log("Use random repo now!");
			else
					  console.log("AJAX call to backend now!");
		};
}
