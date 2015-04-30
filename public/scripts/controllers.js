var repogramsControllers = angular.module('repogramsControllers', ['ngSanitize']);

repogramsControllers.controller('RepogramsConfig',
  ['$rootScope', '$scope', '$modal', 'metricSelectionService', 'blockLengthSelectionService', 'zoomService', 'reposService',
    function ($rootScope, $scope, $modal, metricSelectionService, blockLengthSelectionService, zoomService, reposService) {

      // Services and controllers
      $scope.metricSelectionService = metricSelectionService;
      $scope.blockLengthSelectionService = blockLengthSelectionService;
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
              while (reposService.getAllRepositories().length) {
                $scope.reposService.removeRepo(0);
              }

              $scope.metricSelectionService.clear();
              $scope.setIsMetricsFirst(example.metricsFirst);

              for (var i = 0; i < example.metrics.length; i++) {
                $scope.metricSelectionService.swapMetric(example.metrics[i]);
              }

              $scope.blockLengthSelectionService.setBlockLengthModes(example.blockLengthMode, example.normalizationMode);

              $scope.selectedZoom = example.zoom;
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

      $scope.allBlockLengthModes = $scope.blockLengthSelectionService.getAllBlockLengthModes();
      $scope.blockLengthModesOrder = $scope.blockLengthSelectionService.getBlockLengthModesOrder();
      $scope.allNormalizationModes = $scope.blockLengthSelectionService.getAllNormalizationModes();
      $scope.normalizationModesOrder = $scope.blockLengthSelectionService.getNormalizationModesOrder();
      $scope.selectedBlockLengthModeId = $scope.blockLengthSelectionService.getSelectedBlockLengthModeId();
      $scope.selectedNormalizationModeId = $scope.blockLengthSelectionService.getSelectedNormalizationModeId();
      $scope.selectedBlockLengthMode = $scope.allBlockLengthModes[$scope.selectedBlockLengthModeId];
      $scope.selectedNormalizationMode = $scope.allNormalizationModes[$scope.selectedNormalizationModeId];

      $scope.$on('blockLengthModeChange', function (event, selectedBlockLengthModeId, selectedNormalizationModeId) {
        $scope.selectedBlockLengthModeId = selectedBlockLengthModeId;
        $scope.selectedNormalizationModeId = selectedNormalizationModeId;
        $scope.selectedBlockLengthMode = $scope.allBlockLengthModes[$scope.selectedBlockLengthModeId];
        $scope.selectedNormalizationMode = $scope.allNormalizationModes[$scope.selectedNormalizationModeId];

        $scope.blockLengthSelectionService.updateAllBlockLengths($scope.reposService.getAllRepositories());
      });

      $scope.$on('hiddenCommitsChange', function (event, repository) {
        var allRepositories = $scope.reposService.getAllRepositories();
        $scope.blockLengthSelectionService.generateBaseLengthsForNewRepository(allRepositories, repository);
      });

      $scope.switchBlockLengthMode = function () {
        $modal.open({
          scope: $scope,
          template: '<form>' +
          '<div class="modal-header"><h3 class="modal-title">Select new block length</h3></div>' +
          '<div class="modal-body block-length-selector">' +
          '<div class="form-group">' +
          '<table class="table">' +
          '<thead>' +
          '<tr>' +
          '<th></th>' +
          '<th ng-repeat="normalizationModeId in normalizationModesOrder"><i class="fa fa-{{allNormalizationModes[normalizationModeId].icon}}"></i> {{allNormalizationModes[normalizationModeId].label}}</th>' +
          '</tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr ng-repeat="blockLengthModeId in blockLengthModesOrder">' +
          '<th><i class="fa fa-{{allBlockLengthModes[blockLengthModeId].icon}}"></i> {{allBlockLengthModes[blockLengthModeId].label}}</th>' +
          '<td ng-repeat="normalizationModeId in normalizationModesOrder">' +
          '<label ng-mouseenter="activate(allBlockLengthModes[blockLengthModeId], allNormalizationModes[normalizationModeId])" ng-mouseleave="deactivate()">' +
          '<input type="radio" name="blockLengthMode" ng-checked="blockLengthModeId == selectedBlockLengthModeId && normalizationModeId == selectedNormalizationModeId" ng-click="swap(blockLengthModeId, normalizationModeId)">' +
          '</label>' +
          '</td>' +
          '</tr>' +
          '</tbody>' +
          '</table>' +
          '</div>' +
          '<div class="form-group alert" ng-class="{\'alert-warning\': isHovering, \'alert-info\': !isHovering}">' +
          '<p ng-if="isHovering">This mode:</p>' +
          '<p ng-if="!isHovering">Currently active mode:</p>' +
          '<p><i class="fa fa-{{activeBlockLengthMode.icon}}"></i> <strong>{{activeBlockLengthMode.label}}</strong>: {{activeBlockLengthMode.description}}</p>' +
          '<p><i class="fa fa-{{activeNormalizationMode.icon}}"></i> <strong>{{activeNormalizationMode.label}}</strong>: {{activeNormalizationMode.description}}</p>' +
          '</div>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-default" ng-click="dismiss()">Cancel</button>' +
          '</div>' +
          '</form>',
          controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            $scope.dismiss = $modalInstance.dismiss;
            $scope.activeBlockLengthMode = $scope.selectedBlockLengthMode;
            $scope.activeNormalizationMode = $scope.selectedNormalizationMode;
            $scope.isHovering = false;

            $scope.swap = function (blockLengthModeId, normalizationModeId) {
              $scope.blockLengthSelectionService.setBlockLengthModes(blockLengthModeId, normalizationModeId);
              $modalInstance.close();
            };
            $scope.activate = function (newActiveBlockLengthMode, newActiveNormalizationMode) {
              $scope.activeBlockLengthMode = newActiveBlockLengthMode;
              $scope.activeNormalizationMode = newActiveNormalizationMode;
              $scope.isHovering = true;
            };
            $scope.deactivate = function () {
              $scope.activeBlockLengthMode = $scope.selectedBlockLengthMode;
              $scope.activeNormalizationMode = $scope.selectedNormalizationMode;
              $scope.isHovering = false;
            };
          }]
        });
      };

      $scope.selectedZoom = $scope.zoomService.getSelectedZoom();
      $scope.changeZoom = function () {
        $scope.zoomService.setZoom($scope.selectedZoom);
      };
      $scope.translateZoom = function (value) {
        return "×" + value;
      };
      $scope.$on('zoomChange', function () {
        $scope.blockLengthSelectionService.updateAllBlockLengths($scope.reposService.getAllRepositories());
      });
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
          'emessage': "Please enter a repository URL"
        });
        return;
      }

      var result = $http.post(
        '/app/getGitData',
        {"repourl": url}
      );
      result.success(function (data) {
        metricsRunner.runMetricsAsync(data, function (metricData) {
          $scope.processing = false;
          reposService.addRepo({
            "name": url.split('/').pop(),
            "url": $scope.importURL,
            "metricData": metricData
          });
          $scope.importURL = '';
          if (onSuccess) {
            window.setTimeout(onSuccess, 1000);
          }
        });
      });
      result.error(function (data, status) {
        $scope.processing = false;
        if (status == 400) {
          $scope.errors.push(data);
        } else if (status == 504) {
          $scope.errors.push({
            'emessage': "Gateway timeout. The repository is likely too large for this server."
          });
        } else {
          $scope.errors.push({
            'emessage': "Server unreachable, try again later or try a different URL."
          });
        }
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
    $scope.numSelectedRepos = reposService.getAllRepositories().length;
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

    $scope.$on('reposChange', function (event, allRepositories) {
      $scope.numSelectedRepos = allRepositories.length;
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

    $scope.repos = reposService.getAllRepositories();
    $scope.removeRepo = function (pos) {
      reposService.removeRepo(pos);
    };
    $scope.moveUp = function (index) {
      reposService.moveRepoUp(index);
    };
    $scope.moveDown = function (index) {
      reposService.moveRepoDown(index);
    };
  }]);
