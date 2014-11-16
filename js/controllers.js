var repogramsControllers = angular.module('repogramsControllers',[]);

repogramsControllers.controller('RepogramsConfig',
	['$scope', 'metricSelectionService', 'blenSelectionService', 'zoomService',
	function ($scope, metricSelectionService, blenSelectionService, zoomService){
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
        
        $scope.zoomService = zoomService;
        $scope.currentZoom = $scope.zoomService.getSelectedZoom(); 
        $scope.changeZoom = function() {
        	$scope.zoomService.setZoom($scope.currentZoom);
        }
        
	}
	]);

repogramsControllers.controller('RepogramsRender',
	['$scope','reposService',
	function ($scope, reposService){
		$scope.repos = reposService.getRepoArr();
		$scope.removeRepo = function (pos){
				reposService.removeRepo(pos);
		};
	}
	]);

repogramsControllers.controller('RepogramsImporter',
	['$scope', '$http', 'reposService', 'metricsRunner', function ($scope, $http, reposService, metricsRunner){
	$scope.ImportButtonText = "Add";
        $scope.errors = [];
        $scope.processing = false;
        $scope.closeAlert = function(index) {
          $scope.errors.splice(index, 1);
        };
        $scope.changeInput = function() {
          $scope.errors.length = 0;
        };
	$scope.importRepo = function() {
          $scope.processing = true;
          $scope.errors.length = 0;
          var url = $scope.importURL;
          if (undefined === url) {
            $scope.processing = false;
            $scope.errors.push({
              "emessage": "Please enter a repository URL"
            });
            return;
          }
          console.log("fetch " + url);
          var result = $http.post(
             "/getGitData",
             {"repourl": url}
          );
          result.success(function(data) {
            metricsRunner.runMetricsAsync(data, function(metricData) {
              $scope.processing = false;
              console.log(metricData);
              reposService.addRepo({
                "name": url.split("/").pop(),
                "url": $scope.importURL,
                "metricData": metricData
              });
            });
          });
          result.error(function(data, status, headers, config) {
            $scope.processing = false;
            console.log(status);
            $scope.errors.push(data);
          });
        };
	$scope.prepare = function(){
		$scope.importURL = "https://github.com/sqlitebrowser/sqlitebrowser" 
		$scope.importRepo();
		$scope.importURL = "https://github.com/coolwanglu/vim.js"
		$scope.importRepo();
		$scope.importURL = "https://github.com/mattgallagher/AudioStreamer"
		$scope.importRepo();
		$scope.importURL =  "https://github.com/LightTable/LightTable"
		$scope.importRepo();
		$scope.importURL = "https://github.com/jch/html-pipeline"
		$scope.importRepo();
	}
	$scope.prepare();
}]);

