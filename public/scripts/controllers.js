var repogramsControllers = angular.module('repogramsControllers', ['ngSanitize']);

repogramsControllers.controller('RepogramsConfig',
  ['$rootScope', '$scope', '$modal', 'metricSelectionService', 'blenSelectionService', 'zoomService', 'reposService',
    function ($rootScope, $scope, $modal, metricSelectionService, blenSelectionService, zoomService, reposService) {

      // Services and controllers
      $scope.metricSelectionService = metricSelectionService;
      $scope.blenSelectionService = blenSelectionService;
      $scope.zoomService = zoomService;
      $scope.reposService = reposService;

      // Examples
      $scope.examples = ExampleSets;

      $scope.loadExamples = function () {
        $modal.open({
          scope: $scope,
          template: '<form>' +
          '<div class="modal-header"><h3 class="modal-title">Select an example to load</h3></div>' +
          '<div class="modal-body">' +
          '<div class="form-group" ng-repeat="(i, example) in examples">' +
          '<label for="example_{{i}}"><button id="example_{{i}}" class="btn btn-sm btn-primary" type="checkbox" ng-click="accept(example)">Load</button> {{example.name}}</label>' +
          '</div>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-default" ng-click="dismiss()">Cancel</button>' +
          '</div>' +
          '</form>',
          controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            $scope.dismiss = $modalInstance.dismiss;
            $scope.accept = function (example) {
              while (reposService.getRepoArr().length) {
                $scope.reposService.removeRepo(0);
              }

              $scope.metricSelectionService.clear();
              $scope.setIsMetricsFirst(example.metricsFirst);

              for (var i = 0; i < example.metrics.length; i++) {
                $scope.metricSelectionService.swapMetric(example.metrics[i]);
              }

              var allBlensMods = $scope.blenSelectionService.getAllBlenMods();
              for (i = 0; i < allBlensMods.length; i++) {
                var blenMod = allBlensMods[i];
                if (blenMod.id == example.blen) {
                  $scope.blenSelectionService.setBlenMod(blenMod);
                  break;
                }
              }

              $scope.currentZoom.num = example.zoom;
              $scope.changeZoom();

              $rootScope.$broadcast('loadExampleRepos', example.repositories);

              $modalInstance.close();
            };
          }]
        });
      };

      $scope.setIsMetricsFirst = function (value) {
        $scope.isMetricsFirst = value;
      };

      $scope.$watch('isMetricsFirst', function (value) {
        $scope.metricSelectionService.setIsMetricsFirst(value);
      });

      $scope.allMetrics = Metrics;
      $scope.metricRegistrationIds = MetricsOrder;
      $scope.selectedMetricIds = metricSelectionService.getSelectedMetricIds();
      $scope.selectedMetricObjects = metricSelectionService.getSelectedMetricObjects();
      $scope.$on('selectedMetricsChange', function () {
        $scope.selectedMetricIds = metricSelectionService.getSelectedMetricIds();
        $scope.selectedMetricObjects = metricSelectionService.getSelectedMetricObjects();
      });

      $scope.switchMetric = function () {
        $modal.open({
          scope: $scope,
          template: '<form>' +
          '<div class="modal-header"><h3 class="modal-title">Select new metric</h3></div>' +
          '<div class="modal-body">' +
          '<div class="form-group" ng-repeat="metricId in metricRegistrationIds">' +
          '<label for="metric_{{metricId}}"><input id="metric_{{metricId}}" type="checkbox" name="metric" ng-checked="isSelected(metricId)" ng-click="swap(metricId)"> <i class="fa fa-{{allMetrics[metricId].icon}}"></i> {{allMetrics[metricId].label}}</label>' +
          '<p ng-bind-html="allMetrics[metricId].description"></p>' +
          '<p class="text-muted" ng-if="allMetrics[metricId].long_description" ng-bind-html="allMetrics[metricId].long_description"></p>' +
          '</div>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-default" ng-click="dismiss()">Apply</button>' +
          '</div>' +
          '</form>',
          controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            $scope.dismiss = $modalInstance.dismiss;
            $scope.swap = function (metricId) {
              $scope.metricSelectionService.swapMetric(metricId);
            };
            $scope.isSelected = function (metricId) {
              return $scope.metricSelectionService.isMetricSelected(metricId);
            }
          }]
        });
      };

      $scope.blenMods = $scope.blenSelectionService.getAllBlenMods();
      $scope.selectedBlenMod = $scope.blenSelectionService.getSelectedBlenMod();
      $scope.$on('blenModChange', function () {
        $scope.selectedBlenMod = $scope.blenSelectionService.getSelectedBlenMod();
      });

      $scope.switchBlen = function () {
        $modal.open({
          scope: $scope,
          template: '<form>' +
          '<div class="modal-header"><h3 class="modal-title">Select new block length</h3></div>' +
          '<div class="modal-body">' +
          '<div class="form-group" ng-repeat="(i, blen) in blenMods">' +
          '<label for="blen_{{i}}"><input id="blen_{{i}}" type="radio" name="blen" ng-checked="blen.selected" ng-click="swap(blen)"> <i class="fa fa-{{blen.icon}}"></i> {{blen.label}}</label>' +
          '<p ng-bind-html="blen.description"></p>' +
          '</div>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-default" ng-click="dismiss()">Cancel</button>' +
          '</div>' +
          '</form>',
          controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            $scope.dismiss = $modalInstance.dismiss;
            $scope.swap = function (blen) {
              $scope.blenSelectionService.setBlenMod(blen);
              $modalInstance.close();
            };
          }]
        });
      };

      $scope.currentZoom = $scope.zoomService.getSelectedZoom();
      $scope.changeZoom = function () {
        $scope.zoomService.setZoom($scope.currentZoom);
      };

      $scope.translateZoom = function (value) {
        return "×" + value;
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
    $scope.importRepo = function (onSuccess) {
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
        "/app/getGitData",
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
          $scope.importURL = "";
          if (onSuccess) {
            window.setTimeout(onSuccess, 1000);
          }
        });
      });
      result.error(function (data, status) {
        $scope.processing = false;
        console.log(status);
        $scope.errors.push(data);
      });
    };

    $scope.reposToLoadAsExample = [];
    $scope.loadNextExampleRepo = function () {
      $scope.importURL = $scope.reposToLoadAsExample.shift();
      if ($scope.importURL) {
        $scope.importRepo($scope.loadNextExampleRepo);
      }
    };
    $scope.$on('loadExampleRepos', function (event, repositories) {
      $scope.reposToLoadAsExample = repositories.slice();
      $scope.loadNextExampleRepo();
    });

  }]);

repogramsControllers.controller('RepogramsDisplayCtrl',
  ['$scope', 'metricSelectionService', 'reposService', function ($scope, metricSelectionService, reposService) {
    $scope.isMetricsFirst = metricSelectionService.isMetricsFirst();
    $scope.selectedMetricObjects = metricSelectionService.getSelectedMetricObjects();
    $scope.selectedMetricIds = metricSelectionService.getSelectedMetricIds();
    $scope.numSelectedRepos = reposService.getRepoArr().length;
    $scope.showIncomparableWarning = false;

    $scope.show = function (metricId) {
      return metricId in $scope.selectedMetricObjects;
    };

    $scope.helpTooltip = function (metricId) {
      var tooltip = '<div class="metric-description">' + Metrics[metricId].description + '</div>';
      if (Metrics[metricId].long_description) {
        tooltip += '\n<div class="metric-long-description">' + Metrics[metricId].long_description + '</div>';
      }
      return tooltip;
    };

    $scope.focusOnUrlImporter = function () {
      jQuery('#importUrlId').focus().fadeTo('fast', 0.5).fadeTo('fast', 1);
    };

    $scope.openSelectMetricsModal = function () {
      window.setTimeout(function () {
        document.getElementById('metricSelect').click();
      }, 0);

    };

    $scope.$on('reposChange', function (evnt, newRepoArr) {
      $scope.numSelectedRepos = newRepoArr.length;
    });

    $scope.$on('multiMetricModeChange', function () {
      $scope.isMetricsFirst = metricSelectionService.isMetricsFirst();
    });

    $scope.$on('selectedMetricsChange', function () {
      $scope.selectedMetricObjects = metricSelectionService.getSelectedMetricObjects();
      $scope.selectedMetricIds = metricSelectionService.getSelectedMetricIds();
      $scope.showIncomparableWarning = false;

      // TODO this should not be hard coded
      var idsOfIncomparableMetrics = ['branches_used', 'commit_author'];
      for (var i = 0; i < idsOfIncomparableMetrics; i++) {
        if ($scope.selectedMetricIds.indexOf(idsOfIncomparableMetrics[i]) != -1) {
          $scope.showIncomparableWarning = true;
          break;
        }
      }
    });

    $scope.repos = reposService.getRepoArr();
    $scope.removeRepo = function (pos) {
      reposService.removeRepo(pos);
    };
    $scope.moveUp = function (index) {
      console.log("Moving up " + index);
      reposService.moveRepoUp(index);
    };
    $scope.moveDown = function (index) {
      console.log("Moving down " + index);
      reposService.moveRepoDown(index);
    };
  }]);
