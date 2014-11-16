var repogramsControllers = angular.module('repogramsControllers', ['ngSanitize']);

repogramsControllers.controller('RepogramsConfig',
  ['$scope', '$modal', 'metricSelectionService', 'blenSelectionService', 'zoomService',
    function ($scope, $modal, metricSelectionService, blenSelectionService, zoomService) {
      //default metric is 1
      $scope.metricService = metricSelectionService;
      $scope.metrics = $scope.metricService.getAllMetrics();
      $scope.currentMetric = {
        value: $scope.metrics[0]
      };
      $scope.switchMetric = function () {
        $modal.open({
          scope: $scope,
          template: '<form>' +
          '<div class="modal-header"><h3 class="modal-title">Select new metric</h3></div>' +
          '<div class="modal-body">' +
          '<div class="form-group" ng-repeat="(i, metric) in metrics">' +
          '<label for="metric_{{i}}"><input id="metric_{{i}}" type="radio" name="metric" ng-value="metric" ng-model="currentMetric.value" ng-change="accept()"> <i class="fa fa-{{metric.icon}}"></i> {{metric.label}}</label>' +
          '<p ng-bind-html="metric.description"></p>' +
          '<p class="text-muted" ng-if="metric.long_description" ng-bind-html="metric.long_description"></p>' +
          '</div>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-default" ng-click="dismiss()">Cancel</button>' +
          '</div>' +
          '</form>',
          controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            $scope.dismiss = $modalInstance.dismiss;
            $scope.accept = function (result) {
              $scope.metricService.clear();
              $scope.metricService.addMetric($scope.currentMetric.value);
              $modalInstance.close(result);
            };
          }]
        });
      };

      $scope.blenService = blenSelectionService;
      $scope.blenMods = $scope.blenService.getAllBlenMods();
      $scope.currentBlen = {
        value: $scope.blenService.getSelectedBlenMod()
      };
      $scope.switchBlen = function () {
        // TODO this is very similar to the metrics modal, consolidate this together
        $modal.open({
          scope: $scope,
          template: '<form>' +
          '<div class="modal-header"><h3 class="modal-title">Select new block length</h3></div>' +
          '<div class="modal-body">' +
          '<div class="form-group" ng-repeat="(i, blen) in blenMods">' +
          '<label for="blen_{{i}}"><input id="blen_{{i}}" type="radio" name="blen" ng-value="blen" ng-model="currentBlen.value" ng-change="accept()"> <i class="fa fa-{{blen.icon}}"></i> {{blen.label}}</label>' +
          '<p ng-bind-html="blen.description"></p>' +
          '</div>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-default" ng-click="dismiss()">Cancel</button>' +
          '</div>' +
          '</form>',
          controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            $scope.dismiss = $modalInstance.dismiss;
            $scope.accept = function (result) {
              $scope.blenService.setBlenMod($scope.currentBlen.value);
              $modalInstance.close(result);
            };
          }]
        });
      };

      $scope.zoomService = zoomService;
      $scope.currentZoom = $scope.zoomService.getSelectedZoom();
      $scope.changeZoom = function () {
        $scope.zoomService.setZoom($scope.currentZoom);
      };
      
      $scope.translateZoom = function (value) {
        return "×" + value;
      };

    }
  ]);

repogramsControllers.controller('RepogramsRender',
  ['$scope', 'reposService',
    function ($scope, reposService) {
      $scope.repos = reposService.getRepoArr();
      $scope.removeRepo = function (pos) {
        reposService.removeRepo(pos);
      };
    }
  ]);

repogramsControllers.controller('RepogramsImporter',
  ['$scope', '$http', 'reposService', 'metricsRunner', function ($scope, $http, reposService, metricsRunner) {
    $scope.importURL = null;
    $scope.ImportButtonText = "Add";
    $scope.errors = [];
    $scope.processing = false;
    $scope.closeAlert = function (index) {
      $scope.errors.splice(index, 1);
    };
    $scope.changeInput = function () {
      $scope.errors.length = 0;
    };
    $scope.importRepo = function () {
      $scope.processing = true;
      $scope.errors.length = 0;
      var url = $scope.importURL;
      if (!url) {
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
      result.success(function (data) {
        metricsRunner.runMetricsAsync(data, function (metricData) {
          $scope.processing = false;
          console.log(metricData);
          reposService.addRepo({
            "name": url.split("/").pop(),
            "url": $scope.importURL,
            "metricData": metricData
          });
        });
      });
      result.error(function (data, status, headers, config) {
        $scope.processing = false;
        console.log(status);
        $scope.errors.push(data);
      });
      $scope.prepare = function() {
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
      };
      $scope.prepare();
    };
  }]);

