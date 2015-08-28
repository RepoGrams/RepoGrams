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
          templateUrl: '/templates/modal-state.html',
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
                  console.warn('state is missing a field: normalizationMode (default: "project")');
                  state.normalizationMode = 'project';
                }
                if (!(state.normalizationMode in blockLengthSelectionService.getAllNormalizationModes())) {
                  console.warn('state has unknown normalizationMode: ' + state.normalizationMode + ' (default: "project")');
                  state.normalizationMode = 'project';
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
              $scope.changeZoom(state.zoom);

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
              repositories: reposService.getAllRepositoryUrls(),
              hiddenCommits: reposService.getAllHiddenCommits()
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
          templateUrl: '/templates/modal-metrics.html',
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


      $scope.anyHiddenCommits = $scope.reposService.anyHiddenCommits();

      $scope.unhideCommits = function () {
        $modal.open({
          scope: $scope,
          templateUrl: '/templates/modal-unhide-commits.html',
          controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            $scope.dismiss = $modalInstance.dismiss;
            $scope.allRepositories = $scope.reposService.getAllRepositories();
            $scope.hiddenCommits = $scope.reposService.getAllHiddenCommits();

            $scope.toggle = function (repoIndex, commitId) {
              $scope.reposService.toggleCommitVisibility(repoIndex, commitId);

              if (!$scope.reposService.anyHiddenCommits()) {
                $modalInstance.dismiss();
              }
            };

            $scope.$on('hiddenCommitsChange', function (event, repository) {
              $scope.hiddenCommits = $scope.reposService.getAllHiddenCommits();
            });

            $scope.$on('reposChange', function (event, allRepositories) {
              $scope.allRepositories = allRepositories;
            });
          }]
        })
      };

      $scope.$on('hiddenCommitsChange', function (event, repository) {
        var allRepositories = $scope.reposService.getAllRepositories();
        $scope.blockLengthSelectionService.generateBaseLengthsForNewRepository(allRepositories, repository);
        $scope.anyHiddenCommits = $scope.reposService.anyHiddenCommits();
      });

      $scope.switchBlockLengthMode = function () {
        $modal.open({
          scope: $scope,
          templateUrl: '/templates/modal-block-length.html',
          controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            $scope.dismiss = $modalInstance.dismiss;
            $scope.activeBlockLengthMode = $scope.selectedBlockLengthMode;
            $scope.activeNormalizationMode = $scope.selectedNormalizationMode;
            $scope.isNewMode = false;

            $scope.swap = function (blockLengthModeId, normalizationModeId) {
              $scope.blockLengthSelectionService.setBlockLengthModes(blockLengthModeId, normalizationModeId);
              $modalInstance.close();
            };
            $scope.mouseEnter = function (blockLengthModeId, normalizationModeId) {
              $scope.activeBlockLengthMode = $scope.allBlockLengthModes[blockLengthModeId];
              $scope.activeNormalizationMode = $scope.allNormalizationModes[normalizationModeId];
              $scope.isNewMode = blockLengthModeId != $scope.selectedBlockLengthModeId || normalizationModeId != $scope.selectedNormalizationModeId;
            };
            $scope.mouseLeave = function () {
              $scope.activeBlockLengthMode = $scope.selectedBlockLengthMode;
              $scope.activeNormalizationMode = $scope.selectedNormalizationMode;
              $scope.isNewMode = false;
            };
          }]
        });
      };

      $scope.selectedZoom = $scope.zoomService.getSelectedZoom();
      $scope.incrementZoom = function () {
        if($scope.selectedZoom != 100) {
          $scope.selectedZoom += 1;
          $scope.changeZoom($scope.selectedZoom);
        }
      };
      $scope.decrementZoom = function() {
        if($scope.selectedZoom != 1) {
          $scope.selectedZoom -= 1;
          $scope.changeZoom($scope.selectedZoom);
        }
      };
      $scope.changeZoom = function (newZoom) {
        $scope.zoomService.setZoom(newZoom);
      };
      $scope.translateZoom = function (value) {
        return "×" + value;
      };
      $scope.$on('zoomChange', function () {
        $scope.selectedZoom = $scope.zoomService.getSelectedZoom();
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

    $scope.importRandomRepo = function () {
      var MAX_GITHUB_REPO_ID = 41179859; //This is currently the max id of public repos on github
      var MAX_IMPORT_SIZE = 10000; //This is in KB

      function sizeCheck(repoName, url) {

        function checkSize(size) {
          if (size <= MAX_IMPORT_SIZE) {
            $scope.importURL = url + '.git';
            $scope.importRepository();
          } else {
            $scope.importRandomRepo();
          }
        }

        $.getJSON('https://api.github.com/search/repositories?q=repo:' + repoName + '+fork:true', {}, 
          function (result) {
            var item = result.items[0];
            if (item) {
              var size = item.size;
              checkSize(size);
            } else {
              $scope.importRandomRepo();
            }
          }
        ).fail(function (result) {
            $scope.errors.push({
              'emessage': "The Repository may have been deleted. Please try again"
            })
        });
      }

      function randomIntFromInterval(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
      }

      var ID = randomIntFromInterval(0, MAX_GITHUB_REPO_ID);

      function sendRequest() {
        $.getJSON('https://api.github.com/repositories?since=' + ID, {}, 
          function (data) {
            var object = data[0];
            if (object) {
              var repoName = object.full_name;
              var giturl = object.html_url;
              console.log(object.id);

              sizeCheck(repoName, giturl);
            }
          }
        ).fail(function(data) {
            $scope.errors.push({
              'emessage': "You have reached the rate limit for github API requests. Please try again at a later time."
            });
          }
        );
      }
     
      sendRequest();
    };

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

// Only Chrome, Chromium, Firefox work
repogramsControllers.controller('UnsupportedBrowserCtrl', ['$scope', function($scope) {
    var checkBrowser = function() {

        var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
        var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
        var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        // At least Safari 3+: "[object HTMLElementConstructor]"
        var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
        var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6

        if (!isFirefox && !isChrome) {
           return true;
        }

        return false;
    };

    $scope.data = { visible: checkBrowser() };

    $scope.closeAlert = function () {
      $scope.data.visible = false;
    };

  }]);

repogramsControllers.controller('RepoGramsHelpCtrl', ['$scope', '$modal', function($scope, $modal) {
    $scope.openHelpModal = function () {
        $modal.open({
          scope: $scope,
          templateUrl: '/templates/modal-help.html',
          controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            $scope.dismiss = $modalInstance.dismiss;
            
          }]
        });
      };

  }]);
