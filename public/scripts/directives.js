var repogramsDirectives = angular.module('repogramsDirectives', []);

repogramsDirectives.directive('rgRenderMetric', ['$interpolate', '$compile', '$modal', 'reposService', 'metricSelectionService', 'blockLengthSelectionService', 'zoomService',
  function ($interpolate, $compile, $modal, reposService, metricSelectionService, blockLengthSelectionService, zoomService) {
    var commitBlocksSkeletons = {};

    return {
      restrict: 'E',
      scope: {
        metricId: '=metricId',
        repoIndex: '=repoIndex',
        show: '=ngShow'
      },
      templateUrl: '/templates/rg-render-metric.html',
      link: function ($scope, element) {
        // set up directive
        $scope.reposService = reposService;
        $scope.metricSelectionService = metricSelectionService;
        $scope.blockLengthSelectionService = blockLengthSelectionService;
        $scope.repo = reposService.getRepository($scope.repoIndex);
        $scope.selectedZoom = zoomService.getSelectedZoom();
        $scope.noOfCommits = $scope.repo.metricData.churns.length;
        $scope.selectedMetricIDs = metricSelectionService.getSelectedMetricIds();

        $scope.popModal = function (event) {
          var commitId = $(event.target).attr('data-commit-id');
          var commitURL = $(event.target).attr('data-commit-url');
          var commitIndex = parseInt($(event.target).attr('data-commit-index'));
          var selectedMetricVals = [];
          for (i = 0; i < $scope.selectedMetricIDs.length; i++) {
                 var metric = $scope.selectedMetricIDs[i];
                 var value = $scope.repo.metricData[$scope.selectedMetricIDs[i]][commitIndex];
                 selectedMetricVals[i] = metric + ': ' + value;
          }
          $modal.open({
            scope: $scope,
            templateUrl: '/templates/modal-commit-info.html',
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
              $scope.commitId = commitId;
              $scope.commitURL = commitURL;
              $scope.commitMessage = $scope.repo.metricData.commit_messages[commitIndex];
              $scope.selectedMetricValues = selectedMetricVals;
              $scope.dismiss = $modalInstance.dismiss;
              $scope.toggleVisibility = function () {
                reposService.toggleCommitVisibility($scope.$parent.repoIndex, $scope.commitId);
                $scope.dismiss();
              };
            }]
          });
        };

        // template string for individual blocks - this is done deliberately outside of AngularJS for performance issues
        // Our apologies for mixing JS and HTML in the same file.
        var templateBlock = '<div class="commit-block" data-commit-id="{{commitId}}" data-commit-url="{{commitURL}}" data-commit-index="{{id}}" style="background-color: red; width: {{width}};"></div>';
        var templateBlockString = $interpolate(templateBlock);

        // insert individual commit blocks with the correct size into container
        var commitBlocks = '';
        var repoURL = $scope.repo.url;
        var numOfCommits = $scope.repo.metricData[$scope.metricId].length;

        if (repoURL in commitBlocksSkeletons && commitBlocksSkeletons[repoURL].numOfCommits == numOfCommits) {
          commitBlocks = commitBlocksSkeletons[repoURL].skeleton;
        } else {
          for (var i = 0; i < numOfCommits; i++) {
            var commitMsg = $scope.repo.metricData.commit_messages[i];
            var msg = _.escape(commitMsg.length > 40 ? commitMsg.substring(0, 39) + '…'
              : commitMsg);
            var commitId = $scope.repo.metricData.checksums[i];
            var commitURL = repoURL.replace(/\.git$|$/, '/commit/' + commitId);
            var tooltip = msg + '\u000A(Click for details)';
            var context = {
              width: $scope.repo.widths[i],
              tooltip: tooltip,
              commitId: commitId,
              commitURL: commitURL,
              id: i
            };
            commitBlocks += templateBlockString(context);
          }
          commitBlocksSkeletons[repoURL] = {
            numOfCommits: numOfCommits,
            skeleton: commitBlocks
          };
        }
        /* Avoid blocking the UI for too long by using $evalAsync
         * Blocking is dominated by compile, but at least not everything blocks*/
        var postponed = function ($scope) {
          var innerMost = element.find('.individual-metric');
          innerMost.html(commitBlocks);
          $scope.individualBlocks = jQuery.makeArray(innerMost.children());

          function updateCommitBlockVisualization() {
            if (!$scope.show) {
              return;
            }

            // pre-compute colors outside of updating DOM
            var length = $scope.repo.metricData[$scope.metricId].length;
            var newColors = new Array(length);
            var newTitles = new Array(length);
            for (var i = 0; i < length; i++) {
              var metricValue = $scope.repo.metricData[$scope.metricId][i];
              var metricReadableValue = Metrics[$scope.metricId].tooltip(metricValue);
              var commitMessage = $scope.repo.metricData.commit_messages[i];
              commitMessage = _.escape(commitMessage.length > 40 ? commitMessage.substring(0, 39) + '…' : commitMessage);
              var commitHash = $scope.repo.metricData.checksums[i].substr(0, 8);

              newColors[i] = Metrics[$scope.metricId].mapper.map(metricValue, Metrics[$scope.metricId].colors);
              newTitles[i] = metricReadableValue + "\n\nCommit " + commitHash + ": " + commitMessage;
            }
            chunkwiseLoop(0, length, /*chunksize=*/100, function (index) {
              // set color according to metric
              $scope.individualBlocks[index].style.backgroundColor = newColors[index];
              $scope.individualBlocks[index].title = newTitles[index];
            });
          }

          function chunkwiseLoop(start, stop, chunksize, task) {
            for (var i = 0; i <= chunksize && start + i < stop; ++i) {
              task(/*current index =*/ start + i);
            }
            if (start + i < stop) {
              setTimeout(function () {
                chunkwiseLoop(start + i, stop, chunksize, task)
              }, 0);
            }
          }

          function updateWidth() {
            if (!$scope.show) {
              return;
            }

            var length = $scope.repo.metricData[$scope.metricId].length;
            var widths = $scope.repo.widths;

            // perform a chunkwise DOM update
            chunkwiseLoop(0, length, /*chunksize=*/100, function (index) {
              $scope.individualBlocks[index].style.width = widths[index];
            });
          }


          // set colors for each metric that should be displayed
          setTimeout(updateCommitBlockVisualization, 0);

          // register watches to trigger re-computations

          // the mapper might change when a new repo is added, and the max value increases
          $scope.$on('mapperChange', function (evnt, metricId) {
            if (metricId == $scope.metricId) {
              setTimeout(updateCommitBlockVisualization, 0);
            }
          });

          $('.multi-metrics-metrics-first .repo-collection').on('scroll', function () {
            $('.multi-metrics-metrics-first .repo-collection').scrollLeft($(this).scrollLeft());
          });

          $('.render-metric .commit-block').hover(function () {
            var commitId = $(this).attr('data-commit-id');
            $('.render-metric .commit-block[data-commit-id="' + commitId + '"]').addClass('hover');
          }, function () {
            $('.render-metric .commit-block.hover').removeClass('hover');
          });

          $scope.$on('blockLengthsChange', updateWidth);

          $scope.$watch($scope.show, function () {
            setTimeout(updateCommitBlockVisualization, 0);
            setTimeout(updateWidth, 0);
          });
        };
        $scope.$evalAsync(postponed);
      }
    };
  }]);

repogramsDirectives.directive('rgLegend', function () {
  return {
    restrict: 'E',
    scope: {metricId: '=metricId'},
    templateUrl: '/templates/rg-legend.html',
    controller: ['$rootScope', '$scope', 'reposService', 'metricSelectionService', function ($rootScope, $scope, reposService, metricSelectionService) {
      $scope.reposService = reposService;
      $scope.metricSelectionService = metricSelectionService;
      $scope.selectedMetricObjects = metricSelectionService.getSelectedMetricObjects();
      $scope.styles = {};


      function setBranchUsageLegend(metricId) {
        $scope.styles[metricId][0] = {
          color: Metrics[metricId].colors[1],
          legendText: "master"
        };

        $scope.styles[metricId][1] = {
          legendText: '<span class="branchUsageRainbow">' +
          '<span class="commit-block"></span>' +
          '<span class="commit-block"></span>' +
          '<span class="commit-block"></span>' +
          '<span class="commit-block"></span>' +
          '<span class="commit-block"></span>' +
          '<span class="commit-block"></span>' +
          '</span> … other branches'
        };
      }

      function setCommitAuthorLegend(metricId) {
        $scope.styles[metricId][0] = {
          legendText: '<span class="commitAuthorRainbow">' +
          '<span class="commit-block"></span>' +
          '<span class="commit-block"></span>' +
          '<span class="commit-block"></span>' +
          '<span class="commit-block"></span>' +
          '<span class="commit-block"></span>' +
          '<span class="commit-block"></span>' +
          '</span> … unique authors'
        };
      }

      function setStandardMetricLegend(metricId, mappingInfo, colors) {
        for (var i = 0; i < mappingInfo.length; i++) {
          $scope.styles[metricId][i] = {
            color: colors[i],
            legendText: mappingInfo[i].legendText
          };
        }
      }

      $scope.updateLegend = function (metricId, mapper) {
        $scope.styles[metricId] = [];

        // TODO this should not be hard coded
        switch (metricId) {
          case 'branches_used':
            setBranchUsageLegend(metricId);
            break;

          case 'commit_author':
            setCommitAuthorLegend(metricId);
            break;

          default:
            setStandardMetricLegend(metricId, mapper.mappingInfo, Metrics[metricId].colors);
            break;
        }
      };

      for (var metricId in Metrics) {
        if (Metrics.hasOwnProperty(metricId)) {
          $scope.updateLegend(metricId, Metrics[metricId].mapper);
        }
      }

      $scope.$on('mapperChange', function (evnt, metricId, mapper) {
        $scope.updateLegend(metricId, mapper);
      }, true);
    }]
  };
});
