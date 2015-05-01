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
      $scope.exampleStates = ExampleStates;

      $scope.switchState = function () {
        $modal.open({
          scope: $scope,
          template: '<form>' +
          '<div class="modal-header"><h3 class="modal-title">Load/save state</h3></div>' +
          '<div class="modal-body">' +
          '<div class="form-group">' +
          '<h4><i class="fa fa-cloud-download"></i> Save current state</h4>' +
          '<a class="btn btn-primary" ng-href="data:application/json;charset=utf-8,{{currentStateAsJson}}" download="repograms.json"><i class="fa fa-cloud-download"></i> Download current state</a>' +
          '<p class="help-block">Click to download a file containing the current state of RepoGrams. You can load this file later.</p>' +
          '</div>' +
          '<div class="form-group">' +
          '<h4><i class="fa fa-cloud-upload"></i> Load a saved state</h4>' +
          '<input type="file" id="state_file" name="state_file" onchange="angular.element(this).scope().loadStateFile(this.files)">' +
          '<p class="help-block">Choose a state file to load from.</p>' +
          '<p class="text-danger" ng-if="applyStateError">{{applyStateError}}</p>' +
          '</div>' +
          '<div class="form-group" ng-if="exampleStates.length">' +
          '<h4><i class="fa fa-flask"></i> Load an example state</h4>' +
          '<p class="help-block">You can load any of the following example states provided by RepoGrams</p>' +
          '</div>' +
          '<div class="form-group" ng-repeat="(i, example) in exampleStates">' +
          '<label for="example_{{i}}"><button id="example_{{i}}" class="btn btn-sm btn-primary" type="checkbox" ng-click="applyState(example)">Load</button> {{example.name}}</label>' +
          '</div>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-default" ng-click="dismiss()">Cancel</button>' +
          '</div>' +
          '</form>',
          controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            $scope.dismiss = $modalInstance.dismiss;
            $scope.applyStateError = false;

            $scope.applyState = function (state) {
              {
                // Sanitize the input state. Apply a default value when a field is missing or is invalid.
                if (!state || !(state instanceof Object)) {
                  console.warn('state is not an object');
                  $scope.applyStateError = "Error loading state: passed state is not an JSON object.";
                }
                if (!state.hasOwnProperty('metricsFirst') || typeof state.metricsFirst != 'boolean') {
                  console.warn('state is missing a field: metricsFirst (default: true)');
                  state.metricsFirst = true;
                }
                if (!state.hasOwnProperty('metrics') || !(state.metrics instanceof Array)) {
                  console.warn('state is missing a field: metrics (default: [])');
                  state.metrics = [];
                }
                if (!state.metrics.every(function (metricId) {
                    return metricId in Metrics;
                  })) {
                  console.warn('state has unknown metric IDs in metrics, which will be ignored: ' + state.metrics.filter(function (metricId) {
                    return !(metricId in Metrics);
                  }).join(', '));
                  state.metrics = state.metrics.filter(function (metricId) {
                    return metricId in Metrics;
                  });
                }
                if (!state.hasOwnProperty('blockLengthMode') || typeof state.blockLengthMode != 'string') {
                  console.warn('state is missing a field: blockLengthMode (default: "fixed")');
                  state.blockLengthMode = 'fixed';
                }
                if (!(state.blockLengthMode in blockLengthSelectionService.getAllBlockLengthModes())) {
                  console.warn('state has unknown blockLengthMode: ' + state.blockLengthMode + ' (default: "fixed")');
                  state.blockLengthMode = 'fixed';
                }
                if (!state.hasOwnProperty('normalizationMode') || typeof state.normalizationMode != 'string') {
                  console.warn('state is missing a field: normalizationMode (default: "individually")');
                  state.normalizationMode = 'individually';
                }
                if (!(state.normalizationMode in blockLengthSelectionService.getAllNormalizationModes())) {
                  console.warn('state has unknown normalizationMode: ' + state.normalizationMode + ' (default: "individually")');
                  state.normalizationMode = 'individually';
                }
                if (!state.hasOwnProperty('zoom') || typeof state.zoom != 'number') {
                  console.warn('state is missing a field: zoom (default: 1)');
                  state.zoom = 1;
                }
                if (state.zoom % 1 != 0 || state.zoom < 1 || state.zoom > 100) {
                  console.warn('state has invalid zoom value: ' + state.zoom + ' (default: 1)');
                  state.zoom = 1;
                }
                if (!state.hasOwnProperty('repositories') || !(state.repositories instanceof Array)) {
                  console.warn('state is missing a field: repositories (default: [])');
                  state.repositories = [];
                }
                if (!state.hasOwnProperty('hiddenCommits') || !(state.hiddenCommits instanceof Array)) {
                  state.hiddenCommits = [];
                }
                while (state.hiddenCommits.length < state.repositories.length) {
                  state.hiddenCommits.push([]);
                }
                if (state.hiddenCommits.length > state.repositories.length) {
                  console.warn('state has a different number of hiddenCommits and repositories. Extras will be ignored');
                  state.hiddenCommits.length = state.repositories.length;
                }
              }

              // Clear all repositories
              $scope.reposService.clear();

              // Change settings to match the new state
              $scope.metricSelectionService.clear();
              $scope.setIsMetricsFirst(state.metricsFirst);
              $scope.metricSelectionService.swapMultipleMetrics(state.metrics);
              $scope.blockLengthSelectionService.setBlockLengthModes(state.blockLengthMode, state.normalizationMode);
              $scope.selectedZoom = state.zoom;
              $scope.changeZoom();

              // Broadcast that we finished loading the settings so that the repositories will start loading
              $rootScope.$broadcast('stateSettingsLoad', state.repositories, state.hiddenCommits);
              $modalInstance.close();
            };

            $scope.loadStateFile = function (files) {
              $scope.applyStateError = false;

              if (files.length == 1) {
                var stateFile = files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                  var stateFileText = e.target.result;
                  try {
                    var state = JSON.parse(stateFileText);
                    $scope.applyState(state);
                  } catch (e) {
                    $scope.applyStateError = "Could not parse this state file: " + e.message;
                  }
                };
                reader.onerror = function (e) {
                  $scope.applyStateError = e.target.error.message;
                };
                reader.onloadend = function (e) {
                  $scope.$apply();
                };
                reader.readAsText(stateFile);
              }

              $scope.$apply();
            };

            $scope.currentStateAsJson = encodeURIComponent(JSON.stringify({
              metrics: metricSelectionService.getSelectedMetricIds(),
              metricsFirst: metricSelectionService.isMetricsFirst(),
              blockLengthMode: blockLengthSelectionService.getSelectedBlockLengthModeId(),
              normalizationMode: blockLengthSelectionService.getSelectedNormalizationModeId(),
              zoom: zoomService.getSelectedZoom(),
              repositories: reposService.getAllRepositories().map(function (repository) {
                return repository.url;
              }),
              hiddenCommits: reposService.getAllRepositories().map(function (repository) {
                var commitIds = [];
                repository.hiddenCommits.forEach(function (commitId) {
                  commitIds.push(commitId);
                });
                return commitIds;
              })
            }));
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
    $scope.importRepository = function (onSuccess) {
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
          reposService.addRepository({
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


    $scope.$on('stateSettingsLoad', function (event, repositories, hiddenCommits) {
      var repositoriesToLoad = repositories.slice();
      var hiddenCommitsToLoad = hiddenCommits.slice();

      var loadRepositories = function () {
        $scope.importURL = repositoriesToLoad.shift();
        if ($scope.importURL) {
          $scope.importRepository(function () {
            loadHiddenCommits();
            loadRepositories();
          });
        }
      };

      var loadHiddenCommits = function () {
        var commitIds = hiddenCommitsToLoad.shift();
        var repoIndex = reposService.getAllRepositories().length - 1;
        reposService.toggleMultipleCommitVisibilities(repoIndex, commitIds);
      };

      loadRepositories();
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
    $scope.removeRepository = function (pos) {
      reposService.removeRepository(pos);
    };
    $scope.moveUp = function (index) {
      reposService.moveRepositoryUp(index);
    };
    $scope.moveDown = function (index) {
      reposService.moveRepositoryDown(index);
    };
  }]);
