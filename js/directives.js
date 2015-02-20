var repogramsDirectives = angular.module('repogramsDirectives', []);

repogramsDirectives.directive('rgRenderMetric', ['$interpolate', '$compile', '$modal', 'reposService', 'blenService', 'metricSelectionService', 'blenSelectionService', 'zoomService', 
function ($interpolate, $compile, $modal, reposService, blenService, metricSelectionService, blenSelectionService, zoomService) {
  var repo2skeleton = {};
  return {

    restrict: 'E',
    scope: {
      metricId: "=metricId",
      repoIndex: "=repoIndex",
      visible: "&visible"
    },
    template: '<div class="renderMetric"><div style="width:100%; overflow: visible; white-space: nowrap;">' +
    '<div class="individualMetric" ng-click="popModal($event)" style="width:100%; padding: 1px; overflow: visible; white-space: nowrap;">' +
    '</div></div></div>',
    link: function ($scope, element, attrs) {
      // set up directive
      $scope.reposService = reposService;
      $scope.metricSelectionService = metricSelectionService;
      $scope.blenSelectionService = blenSelectionService;
      $scope.repo = reposService.getRepoArr()[$scope.repoIndex];
      $scope.currentZoom = zoomService.getSelectedZoom();
      $scope.totalChurn = $scope.reposService.getTotalChurnArr()[$scope.repoIndex];
      $scope.maxChurn = $scope.reposService.getMaxChurn();
      $scope.noOfCommits = $scope.repo.metricData.churn.length;

      $scope.popModal = function (event) {
        var commitID = $(event.target).attr("data-commitID");
        var commitURL = $(event.target).attr("data-commitURL");
        var index = $(event.target).attr("data-index");
        $modal.open({
          scope: $scope,
          template: '<div class="modal-header">' +
          '<h3 class="modal-title"><code>{{commitID}}</code></h3>' +
          '</div>' +
          '<div class="modal-body commitDetails">' +
          '<p><a href="{{commitURL}}">{{commitMessage}}</a></p>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-primary" ng-click="dismiss()">OK</button>' +
          '</div>',
          controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            $scope.commitID = commitID;
            $scope.commitURL = commitURL;
            $scope.commitMessage = $scope.repo.metricData.commit_msgs[index];
            $scope.dismiss = $modalInstance.dismiss;
          }]
        });
      };

      // template string for individual blocks
      var templateBlock = '<div class="customBlock" data-commitID="{{commitID}}" data-commitURL="{{commitURL}}" data-index="{{id}}" style="background-color: red; width: {{width}};"></div>';
      var templateBlockString = $interpolate(templateBlock);


      // get any metric to do the initial setup with it
      var firstSelectedMetric = metricSelectionService.getAllMetrics()[0];
      // insert individual commit blocks with the correct size into container
      var currentBlockLengthMode = blenSelectionService.getSelectedBlenMod().id;
      var commitBlocks = "";
      var repoURL = $scope.repo.url;
      if ($scope.repo.url in repo2skeleton) {
        commitBlocks = repo2skeleton[$scope.repo.url];
      } else {
        for (var i = 0; i < $scope.repo.metricData[firstSelectedMetric.id].length; i++) {
          var commitMsg = $scope.repo.metricData.commit_msgs[i];
          var msg = _.escape(commitMsg.length > 40 ? commitMsg.substring(0, 39) + '…'
            : commitMsg);
            var commitID = $scope.repo.metricData.checksums[i];
            var commitURL = repoURL.replace(/\.git$|$/, "/commit/" + commitID);
            var commitHash = commitID.substring(0, 8);
            var tooltip = msg + '\u000A(Click for details)';
            var churn = $scope.repo.metricData.churn[i];
            var context = {
              width: blenService.getWidth(currentBlockLengthMode, churn, $scope.totalChurn, $scope.maxChurn, $scope.noOfCommits, $scope.currentZoom).string,
              tooltip: tooltip,
              commitID: commitID,
              commitURL: commitURL,
              id: i
            };
            commitBlocks += templateBlockString(context);
        }
        repo2skeleton[$scope.repo.url] = commitBlocks;
      }
      /* Avoid blocking the UI for too long by using $evalAsync
       * Blocking is dominated by compile, but at least not everything blocks*/
      var postponed = function($scope) {
        var innerMost = element.find(".individualMetric");
        innerMost.html(commitBlocks);
        $scope.individualBlocks = jQuery.makeArray(innerMost.children());
        $scope.last_metricID = $scope.curentId;
        $scope.last_currentBlockLengthMode = undefined;

        function updateCommitBlockVisualization(metricID) {
          if (!$scope.visible()) {
            $scope.last_metricID = metricID;
            return;
          }
          // precompute colours outside of updating DOM
          var length = $scope.repo.metricData[firstSelectedMetric.id].length;
          var newColours = new Array(length);
          var newTitles = new Array(length);
          for (var i = 0; i < length; i++) {
            var metricValue = $scope.repo.metricData[metricID][i];
            var metricReadableValue = readableValueMapper(metricID, metricValue);
            var commitMessage = $scope.repo.metricData['commit_msgs'][i];
            var commitMessage = _.escape(commitMessage.length > 40 ? commitMessage.substring(0, 39) + '…' : commitMessage);
            var commitHash = $scope.repo.metricData['checksums'][i].substr(0, 8);

            newColours[i] = reposService.mapToColor(metricID, metricValue);
            newTitles[i] = metricReadableValue + "\n\nCommit " + commitHash + ": " + commitMessage;
          }
          chunkwiseLoop(0, length, /*chunksize=*/100, function (index) {
            // set colour according to metric
            $scope.individualBlocks[index].style.backgroundColor = newColours[index];
            $scope.individualBlocks[index].title = newTitles[index];
          });
        }

        function chunkwiseLoop(start, stop, chunksize, task) {
          for (var i = 0; i <= chunksize && start + i < stop; ++i) {
            task(/*current index =*/ start + i);
          }
          if (start + i < stop) {
            setTimeout(chunkwiseLoop, 0, start + i, stop, chunksize, task);
          }
        }

        function updateWidth(currentBlockLengthMode) {
          if (!$scope.visible()) {
            $scope.last_currentBlockLengthMode = currentBlockLengthMode;
            return;
          }
          // precompute width outside of updating DOM
          var length = $scope.repo.metricData[firstSelectedMetric.id].length;
          var newWidths = new Array(length);
          for (var i = 0; i < length; i++) {
            var churn = $scope.repo.metricData.churn[i];
            newWidths[i] = blenService.getWidth(currentBlockLengthMode, churn, $scope.totalChurn, $scope.maxChurn, $scope.noOfCommits, $scope.currentZoom).string;
          }
          // iterate over all commit blocks and
          chunkwiseLoop(0, length, /*chunksize=*/100, function (index) {
            $scope.individualBlocks[index].style.width = newWidths[index];
          });
        }


        // set colors for each metric that should be displayed
        setTimeout(updateCommitBlockVisualization, 0, $scope.metricId);

        // register watches to trigger recomputations

        // the mapper might change when a new repo is added, and the
        // maxvalue increases
        $scope.$on('mapperChange', function (evnt, metricID, newMapper) {
          if (metricID == $scope.metricId) {
            var selectedMetrics = metricSelectionService.getSelectedMetrics();
            // only update visible metrics
            for (var i = 0; i < selectedMetrics.length; i++) {
              if (metricID === selectedMetrics[i].id) {
                updateCommitBlockVisualization(metricID);
                break;
              }
            }
          }
        });

        $('.multi-metrics-metrics-first .repo-collection').on('scroll', function () {
            $('.multi-metrics-metrics-first .repo-collection').scrollLeft($(this).scrollLeft());
        });

        console.log('1');
        $('.renderMetric .customBlock').hover(function() {
          var commitId = $(this).attr('data-commitid');
          $('.renderMetric .customBlock[data-commitid="' + commitId + '"]').addClass('hover');
        }, function() {
          $('.renderMetric .customBlock.hover').removeClass('hover');
        });

        $scope.$on('maxChurnChange', function (evnt, newMaxChurn) {
          $scope.maxChurn = newMaxChurn;
          updateWidth(blenSelectionService.getSelectedBlenMod().id);
        });

        $scope.$on('zoomChange', _.debounce(function (evnt, newZoom) {
          updateWidth(blenSelectionService.getSelectedBlenMod().id);
        }, 200));

        $scope.$watch("blenSelectionService.getSelectedBlenMod()", function (newVal) {
          updateWidth(newVal.id);
        });

        $scope.$watch($scope.visible, function(newVal) {
          if (newVal && $scope.last_metricID !== undefined && $scope.last_currentBlockLengthMode !== undefined) {
            setTimeout(updateCommitBlockVisualization, 0, $scope.last_metricID);
            setTimeout(updateWidth, 0, $scope.last_currentBlockLengthMode);
          }
        });
      };
      $scope.$evalAsync(postponed);
    }
  };
}]);

repogramsDirectives.directive('ngLegend', function () {
  return {
    restrict: 'E',
    scope: { currentMetric :"=current"},
    template: '<ul class="list-inline">' +
      '<li><strong>Legend</strong>: </li>' +
      '<li ng-repeat="style in styles[currentMetric.id]"><span class="customBlock" style="background-color: {{style.color}};" ng-if="style.color"></span> <span ng-bind-html="style.legendText"></span></li>' +
      '</ul>',
    controller: ['$rootScope', '$scope', 'reposService', 'metricSelectionService', function ($rootScope, $scope, reposService, metricSelectionService) {
      $scope.reposService = reposService;
      $scope.metricSelectionService = metricSelectionService;
      $scope.selectedMetrics = metricSelectionService.getSelectedMetrics();
      $scope.styles = {};
      angular.forEach(metricSelectionService.getAllMetrics(), function (value, index) {
        $scope.styles[value.id] = [];
      });

      function setBranchUsageLegend(metricID) {
        $scope.styles[metricID][0] = {
          color: mapperFactory.main_branch_color,
          legendText: "master"
        };

        $scope.styles[metricID][1] = {
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

      function setCommitAuthorLegend(metricID) {
        $scope.styles[metricID][0] = {
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

      function setStandardMetricLegend(newMapper, metricID) {
        var mappingInfo = newMapper.getMappingInfo();
        for (var i = 0; i < mappingInfo.length; i++) {
          $scope.styles[metricID][i] = {
            color: mappingInfo[i].color,
            legendText: mappingInfo[i].legendText
          };
        }
      }

      $scope.$on("mapperChange", function (evnt, metricID, newMapper) {
        console.assert(angular.isDefined(newMapper), "new mapper is not defined!");
        $scope.styles[metricID] = [];

        switch (metricID) {
          case "branch_usage":
            setBranchUsageLegend(metricID);
            break;

          case "commit_author":
            setCommitAuthorLegend(metricID);
            break;

          default:
            setStandardMetricLegend(newMapper, metricID);
            break;
        }
      }, true);

      $rootScope.$broadcast("mapperChange", $scope.currentMetric.id, reposService.getMapper($scope.currentMetric.id));
    }]
  };
});
