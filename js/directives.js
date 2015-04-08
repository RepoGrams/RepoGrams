var repogramsDirectives = angular.module('repogramsDirectives', []);

repogramsDirectives.directive('rgRenderMetric', ['$interpolate', '$compile', '$modal', 'reposService', 'blenService', 'metricSelectionService', 'blenSelectionService', 'zoomService',
  function ($interpolate, $compile, $modal, reposService, blenService, metricSelectionService, blenSelectionService, zoomService) {
    var commitBlocksSkeletons = {};
    return {

      restrict: 'E',
      scope: {
        metricId: "=metricId",
        repoIndex: "=repoIndex",
        show: "=ngShow"
      },
      template: '<div class="renderMetric"><div style="width:100%; overflow: visible; white-space: nowrap;">' +
      '<div class="individualMetric" ng-click="popModal($event)" style="width:100%; padding: 1px; overflow: visible; white-space: nowrap;">' +
      '</div></div></div>',
      link: function ($scope, element) {
        // set up directive
        $scope.reposService = reposService;
        $scope.metricSelectionService = metricSelectionService;
        $scope.blenSelectionService = blenSelectionService;
        $scope.repo = reposService.getRepoArr()[$scope.repoIndex];
        $scope.currentZoom = zoomService.getSelectedZoom();
        $scope.totalChurn = $scope.reposService.getTotalChurnArr()[$scope.repoIndex];
        $scope.maxChurn = $scope.reposService.getMaxChurn();
        $scope.noOfCommits = $scope.repo.metricData.churns.length;

        $scope.popModal = function (event) {
          var commitId = $(event.target).attr("data-commitId");
          var commitURL = $(event.target).attr("data-commitURL");
          var index = $(event.target).attr("data-index");
          $modal.open({
            scope: $scope,
            template: '<div class="modal-header">' +
            '<h3 class="modal-title"><code>{{commitId}}</code></h3>' +
            '</div>' +
            '<div class="modal-body commitDetails">' +
            '<p><a ng-href="{{commitURL}}">{{commitMessage}}</a></p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button class="btn btn-primary" ng-click="dismiss()">OK</button>' +
            '</div>',
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
              $scope.commitId = commitId;
              $scope.commitURL = commitURL;
              $scope.commitMessage = $scope.repo.metricData.commit_messages[index];
              $scope.dismiss = $modalInstance.dismiss;
            }]
          });
        };

        // template string for individual blocks
        var templateBlock = '<div class="customBlock" data-commitId="{{commitId}}" data-commitURL="{{commitURL}}" data-index="{{id}}" style="background-color: red; width: {{width}};"></div>';
        var templateBlockString = $interpolate(templateBlock);

        // insert individual commit blocks with the correct size into container
        var currentBlockLengthMode = blenSelectionService.getSelectedBlenMod().id;
        var commitBlocks = "";
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
            var commitURL = repoURL.replace(/\.git$|$/, "/commit/" + commitId);
            var tooltip = msg + '\u000A(Click for details)';
            var churns = $scope.repo.metricData.churns[i];
            var context = {
              width: blenService.getWidth(currentBlockLengthMode, churns, $scope.totalChurn, $scope.maxChurn, $scope.noOfCommits, $scope.currentZoom).string,
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
          var innerMost = element.find(".individualMetric");
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

          function updateWidth(currentBlockLengthMode) {
            if (!$scope.show) {
              return;
            }

            // pre-compute width outside of updating DOM
            var length = $scope.repo.metricData[$scope.metricId].length;
            var newWidths = new Array(length);
            for (var i = 0; i < length; i++) {
              var churns = $scope.repo.metricData.churns[i];
              newWidths[i] = blenService.getWidth(currentBlockLengthMode, churns, $scope.totalChurn, $scope.maxChurn, $scope.noOfCommits, $scope.currentZoom).string;
            }
            // iterate over all commit blocks and
            chunkwiseLoop(0, length, /*chunksize=*/100, function (index) {
              $scope.individualBlocks[index].style.width = newWidths[index];
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

          $('.renderMetric .customBlock').hover(function () {
            var commitId = $(this).attr('data-commitid');
            $('.renderMetric .customBlock[data-commitid="' + commitId + '"]').addClass('hover');
          }, function () {
            $('.renderMetric .customBlock.hover').removeClass('hover');
          });

          $scope.$on('maxChurnChange', function (evnt, newMaxChurn) {
            $scope.maxChurn = newMaxChurn;
            updateWidth(blenSelectionService.getSelectedBlenMod().id);
          });

          $scope.$on('zoomChange', _.debounce(function () {
            updateWidth(blenSelectionService.getSelectedBlenMod().id);
          }, 200));

          $scope.$watch("blenSelectionService.getSelectedBlenMod()", function (newVal) {
            updateWidth(newVal.id);
          });

          $scope.$watch($scope.show, function () {
            setTimeout(updateCommitBlockVisualization, 0);
            setTimeout(function () {
              updateWidth(blenSelectionService.getSelectedBlenMod().id);
            }, 0);
          });
        };
        $scope.$evalAsync(postponed);
      }
    };
  }]);

repogramsDirectives.directive('ngLegend', function () {
  return {
    restrict: 'E',
    scope: {metricId: "=current"},
    template: '<ul class="list-inline">' +
    '<li><strong>Legend</strong>: </li>' +
    '<li ng-repeat="style in styles[metricId]"><span class="customBlock" style="background-color: {{style.color}};" ng-if="style.color"></span> <span ng-bind-html="style.legendText"></span></li>' +
    '</ul>',
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
          '<span class="customBlock"></span>' +
          '<span class="customBlock"></span>' +
          '<span class="customBlock"></span>' +
          '<span class="customBlock"></span>' +
          '<span class="customBlock"></span>' +
          '<span class="customBlock"></span>' +
          '</span> … other branches'
        };
      }

      function setCommitAuthorLegend(metricId) {
        $scope.styles[metricId][0] = {
          legendText: '<span class="commitAuthorRainbow">' +
          '<span class="customBlock"></span>' +
          '<span class="customBlock"></span>' +
          '<span class="customBlock"></span>' +
          '<span class="customBlock"></span>' +
          '<span class="customBlock"></span>' +
          '<span class="customBlock"></span>' +
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
          case "branches_used":
            setBranchUsageLegend(metricId);
            break;

          case "commit_author":
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

      $scope.$on("mapperChange", function (evnt, metricId, mapper) {
        $scope.updateLegend(metricId, mapper);
      }, true);
    }]
  };
});
