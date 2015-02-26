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
      $scope.examples = [];
      $scope.examples = [
        {
          'name': "Preparation Tasks — Task 1",
          'metrics': ['pom_files'],
          'metricsFirst': true,
          'blen': '1_constant',
          'zoom': 1,
          'repositories': [
            'https://github.com/sqlitebrowser/sqlitebrowser',
            'https://github.com/coolwanglu/vim.js',
            'https://github.com/mattgallagher/AudioStreamer',
            'https://github.com/LightTable/LightTable',
            'https://github.com/jch/html-pipeline'
          ]
        },{
          'name': "Preparation Tasks — Task 2",
          'metrics': ['commit_modularity'],
          'metricsFirst': true,
          'blen': '1_constant',
          'zoom': 1,
          'repositories': [
            'https://github.com/sqlitebrowser/sqlitebrowser',
            'https://github.com/coolwanglu/vim.js',
            'https://github.com/LightTable/LightTable',
            'https://github.com/jch/html-pipeline',
            'https://github.com/GNOME/postr'
          ]
        },{
          'name': "Preparation Tasks — Task 3",
          'metrics': ['branch_complexity'],
          'metricsFirst': true,
          'blen': '1_constant',
          'zoom': 1,
          'repositories': [
            'https://github.com/sqlitebrowser/sqlitebrowser',
            'https://github.com/coolwanglu/vim.js',
            'https://github.com/LightTable/LightTable',
            'https://github.com/jch/html-pipeline',
            'https://github.com/GNOME/postr'
          ]
        },{
          'name': "Main Tasks — Task 1",
          'metrics': ['most_edited_file'],
          'metricsFirst': true,
          'blen': '1_constant',
          'zoom': 1,
          'repositories': [
            'https://github.com/phusion/passenger-docker'
          ]
        },{
          'name': "Main Tasks — Task 2",
          'metrics': ['pom_files'],
          'metricsFirst': true,
          'blen': '1_constant',
          'zoom': 1,
          'repositories': [
            'https://github.com/facebook/css-layout',
            'https://github.com/qiujuer/Genius-Android',
            'https://github.com/JakeWharton/butterknife',
            'https://github.com/AndroidGears/Plugin',
            'https://github.com/pedrovgs/TuentiTV',
            'https://github.com/ksoichiro/Android-ObservableScrollView',
            'https://github.com/square/picasso',
            'https://github.com/google/iosched',
            'https://github.com/square/retrofit'
          ]
        },{
          'name': "Main Tasks — Task 3",
          'metrics': ['branch_usage'],
          'metricsFirst': true,
          'blen': '1_constant',
          'zoom': 1,
          'repositories': [
            'https://github.com/munificent/wren',
            'https://github.com/PHPMailer/PHPMailer',
            'https://github.com/yahoo/pure',
            'https://github.com/stympy/faker',
            'https://github.com/mmozuras/pronto'
          ]
        },{
          'name': "Main Tasks — Task 4",
          'metrics': ['commit_author', 'branch_usage'],
          'metricsFirst': false,
          'blen': '3_fill',
          'zoom': 1,
          'repositories': [
            'https://github.com/JedWatson/touchstonejs',
            'https://github.com/pblittle/docker-logstash',
            'https://github.com/lukasschwab/stackit',
            'https://github.com/arialdomartini/oh-my-git'
          ]
        },{
          'name': "Main Tasks — Task 5",
          'metrics': ['commit_author'],
          'metricsFirst': false,
          'blen': '2_churn',
          'zoom': 1,
          'repositories': [
            'https://github.com/lukasschwab/stackit',
            'https://github.com/deployphp/deployer',
            'https://github.com/sequenceiq/docker-ambari'
          ]
        }
      ];
      $scope.hasExamples = Boolean($scope.examples.length);

      $scope.loadExamples = function () {
        $modal.open({
          scope: $scope,
          template: '<form>' +
          '<div class="modal-header"><h3 class="modal-title">Select an example to load</h3></div>' +
          '<div class="modal-body">' +
          '<div class="form-group" ng-repeat="(i, example) in examples">' +
          '<label for="example_{{i}}"><button id="example_{{i}}" class="btn btn-sm btn-primary" type="checkbox" ng-value="example" ng-click="accept(example)">Load</button> {{example.name}}</label>' +
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

              var allMetrics = $scope.metricSelectionService.getAllMetrics();
              for (var i = 0; i < example.metrics.length; i++) {
                for (var j = 0; j < allMetrics.length; j++) {
                  var exampleMetricId = example.metrics[i];
                  var metric = allMetrics[j];
                  if (metric.id == exampleMetricId) {
                    $scope.metricSelectionService.swapMetric(metric);
                    break;
                  }
                }
              }

              var allBlensMods = $scope.blenSelectionService.getAllBlenMods();
              for (var i = 0; i < allBlensMods.length; i++) {
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

      $scope.metrics = $scope.metricSelectionService.getAllMetrics();
      $scope.selectedMetrics = metricSelectionService.getSelectedMetrics();

      $scope.switchMetric = function () {
        $modal.open({
          scope: $scope,
          template: '<form>' +
          '<div class="modal-header"><h3 class="modal-title">Select new metric</h3></div>' +
          '<div class="modal-body">' +
          '<div class="form-group" ng-repeat="(i, metric) in metrics">' +
          '<label for="metric_{{i}}"><input id="metric_{{i}}" type="checkbox" name="metric" ng-model="metric.selected" ng-click="swap(metric)"> <i class="fa fa-{{metric.icon}}"></i> {{metric.label}}</label>' +
          '<p ng-bind-html="metric.description"></p>' +
          '<p class="text-muted" ng-if="metric.long_description" ng-bind-html="metric.long_description"></p>' +
          '</div>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-default" ng-click="dismiss()">Apply</button>' +
          '</div>' +
          '</form>',
          controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            $scope.dismiss = $modalInstance.dismiss;
            $scope.swap = function (metric) {
              $scope.metricSelectionService.swapMetric(metric);
            };
          }]
        });
      };

      $scope.blenMods = $scope.blenSelectionService.getAllBlenMods();
      $scope.selectedBlenMod = $scope.blenSelectionService.getSelectedBlenMod();
      $scope.$on('blenModChange', function() {
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
          $scope.importURL = "";
          if (onSuccess) {
            window.setTimeout(onSuccess, 1000);
          }
        });
      });
      result.error(function (data, status, headers, config) {
        $scope.processing = false;
        console.log(status);
        $scope.errors.push(data);
      });
    };

    $scope.reposToLoadAsExample = [];
    $scope.loadNextExampleRepo = function() {
      $scope.importURL = $scope.reposToLoadAsExample.shift();
      if ($scope.importURL) {
        $scope.importRepo($scope.loadNextExampleRepo);
      }
    };
    $scope.$on('loadExampleRepos', function(event, repositories) {
      $scope.reposToLoadAsExample = repositories.slice();
      $scope.loadNextExampleRepo();
    });

  }]);

repogramsControllers.controller('RepogramsDisplayCtrl',
  ['$scope','metricSelectionService', 'reposService', function ($scope, metricSelectionService, reposService){
    $scope.isMetricsFirst = metricSelectionService.isMetricsFirst();
    $scope.selectedMetrics = metricSelectionService.getSelectedMetrics();
    $scope.metrics = metricSelectionService.getAllMetrics();
    $scope.numSelectedRepos = reposService.getRepoArr().length;
    $scope.showIncomparableWarning = false;

    $scope.show = function(metric) {
      return $scope.selectedMetrics.indexOf(metric) != -1;
    };

    $scope.insertionOrder = function(metric) {
      return $scope.selectedMetrics.indexOf(metric);
    };

    $scope.helpTooltip = function(metric) {
      var tooltip = '<div class="metric-description">' + metric.description + '</div>';
      if (metric.long_description) {
        tooltip += '\n<div class="metric-long-description">' + metric.long_description + '</div>';
      }
      return tooltip;
    };

    $scope.focusOnUrlImporter = function($event) {
      jQuery('#importUrlId').focus().fadeTo('fast', 0.5).fadeTo('fast', 1);
    };

    $scope.openSelectMetricsModal = function($event) {
      window.setTimeout(function() {
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
      var selectedMetrics = metricSelectionService.getSelectedMetrics();

      var idsOfIncomparableMetrics = ['branch_usage', 'commit_author'];
      for (var i = 0; i < selectedMetrics.length; i++) {
        for (var j = 0; j < idsOfIncomparableMetrics.length; j++) {
          if (selectedMetrics[i].id == idsOfIncomparableMetrics[j]) {
            $scope.showIncomparableWarning = true;
            return;
          }
        }
      }
      $scope.showIncomparableWarning = false;
    });

    $scope.repos = reposService.getRepoArr();
    $scope.removeRepo = function (pos) {
      reposService.removeRepo(pos);
    };
    $scope.moveUp = function(index){
      console.log("Moving up "+index);
      reposService.moveRepoUp(index);
    };
    $scope.moveDown = function(index){
      console.log("Moving down "+index);
      reposService.moveRepoDown(index);
    };
  }]);
