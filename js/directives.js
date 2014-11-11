var repogramsDirectives = angular.module('repogramsDirectives',[]);

repogramsDirectives.directive('ngRenderblock', function(){
        return {
          restrict: 'E',
          scope: {
                commitMsg: "@commitMsg",
                commitID: "@commitId",
                bgColor: "@color",
                width: "=width",
                url: "@url"
          },
          template: '<div class="customBlock" ng-click="popModal()" tooltip-html-unsafe="{{tooltip}}" tooltip-popup-delay="200" style="background-color: {{bgColor}}; width: {{width}};"></div>',
          controller: ['$scope', '$modal', function($scope, $modal) {
            // 40 is the length of commitID
            $scope.msg = $scope.commitMsg.length > 40 ? $scope.commitMsg.substring(0, 39) + '…'
                                                      : $scope.commitMsg;
            $scope.commitURL = $scope.url.replace(/\.git$|$/, "/commit/" + $scope.commitID);
            $scope.commitHash = $scope.commitID.substring(0, 8);
            $scope.tooltip = '<p class="commitMessage"><code>' + $scope.commitHash + '</code> <span>' + $scope.msg + '</span></p><p class="text-muted">Click for details</p>';
            $scope.popModal = function() {
              $modal.open({
                scope: $scope,
                template: '<div class="modal-header"><h3 class="modal-title"><code>{{commitID}}</code></h3></div><div class="modal-body commitDetails"><p><a href="{{commitURL}}">{{commitMsg}}</a></p></div><div class="modal-footer"><button class="btn btn-primary" ng-click="dismiss()">OK</button></div>',
                controller: ['$scope', '$modalInstance', function($scope, $modalInstance) { $scope.dismiss = $modalInstance.dismiss; }]
              });
            };
          }]
        };
});

repogramsDirectives.directive('rgRenderMetric', ['$interpolate', '$compile', '$modal', 'reposService', 'blenService', 'metricSelectionService', 'blenSelectionService', 'zoomService', function($interpolate, $compile, $modal, reposService, blenService, metricSelectionService, blenSelectionService, zoomService) {
  return {

    restrict: 'E',
    scope: {},
    template: '<div class="renderMetric"><div style="width:100%; overflow: auto; white-space: nowrap;">' +
      '<div class="individualMetric" style="width:100%; padding: 1px; overflow: visible; white-space: nowrap;">' +
      '</div></div></div>',
    link: function($scope, element, attrs) {
      // set up directive
      $scope.reposService = reposService;
      $scope.repo = reposService.getRepoArr()[$scope.$parent.$index];
      $scope.totalChurn = reposService.getTotalChurnArr()[$scope.$parent.$index];
      $scope.blenService = blenService;
      $scope.metricSelectionService = metricSelectionService;
      $scope.blenSelectionService = blenSelectionService;
      $scope.currentZoom = zoomService.getSelectedZoom();


      $scope.popModal = function(commitID, commitURL, index) {
        $modal.open({
          scope: $scope,
          template: '<div class="modal-header"><h3 class="modal-title"><code>'+commitID+
                    '</code></h3></div><div class="modal-body commitDetails"><p><a href="'+commitURL+
                    '">'+ $scope.repo.metricData.commit_msgs[index] +'</a></p></div><div class="modal-footer"><button class="btn btn-primary" ng-click="dismiss()">OK</button></div>',
          controller: ['$scope', '$modalInstance', function($scope, $modalInstance) { $scope.dismiss = $modalInstance.dismiss; }]
        });
      };
      // template string for individual blocks
      var templateBlock = '<div class="customBlock" ng-click="popModal(\'{{commitID}}\', \'{{commitURL}}\', {{id}})" tooltip-html-unsafe=\'{{tooltip}}\' tooltip-popup-delay="200" style="background-color: red; width: {{width}};"></div>';
      var templateBlockString = $interpolate(templateBlock);


      // get any metric to do the initial setup with it
      var firstSelectedMetric = metricSelectionService.getAllMetrics()[0];
      // insert individual commit blocks with the correct size into container
      var currentBlockLengthMode = blenSelectionService.getSelectedBlenMod().id;
      var commitBlocks = "";
      var repoURL = $scope.repo.url;
      for( var i = 0; i < $scope.repo.metricData[firstSelectedMetric.id].length; i++) {
       var commitMsg = $scope.repo.metricData.commit_msgs[i];
       var msg = _.escape(commitMsg.length > 40 ? commitMsg.substring(0, 39) + '…'
                                                 : commitMsg);
       var commitID = $scope.repo.metricData.checksums[i];
       var commitURL = repoURL.replace(/\.git$|$/, "/commit/" + commitID);
       var commitHash = commitID.substring(0, 8);
       var tooltip = '<p class=\"commitMessage\"><code>' + commitHash + '</code> <span>' + msg + '</span></p><p class=\"text-muted\">Click for details</p>';
       var churn = $scope.repo.metricData.churn[i];
       var context = {
         width: blenService.getWidth(currentBlockLengthMode, churn, $scope.totalChurn, $scope.currentZoom).string,
         tooltip: tooltip,
         commitID: commitID,
         commitURL: commitURL,
         id: i
       };
       commitBlocks += templateBlockString(context);
      }
      var content = $compile(commitBlocks)($scope);
      var innerMost =  element.find(".individualMetric");
      innerMost.html(content);
      $scope.individualBlocks = jQuery.makeArray(innerMost.children());


      /* TODO: create copy of container if needed (more than one metric) (not
       * necessary currently, because there will only ever be one metric
       * selected; in the advanced version this will change) */

      function updateColors(metricID) {
        // precompute colours outside of updating DOM
        var length = $scope.repo.metricData[firstSelectedMetric.id].length;
        var newColours = new Array(length);
        for( var i = 0; i < length; i++) {
          newColours[i] = reposService.mapToColor(metricID, $scope.repo.metricData[metricID][i]);
        }
        chunkwiseLoop(0, length, /*chunksize=*/100, function(index) {
          // set colour according to metric
          $scope.individualBlocks[index].style.backgroundColor = newColours[index];
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
        // precompute width outside of updating DOM
        var length = $scope.repo.metricData[firstSelectedMetric.id].length;
        var newWidths = new Array(length);
        for( var i = 0; i < length; i++) {
          var churn = $scope.repo.metricData.churn[i];
          newWidths[i] = blenService.getWidth(currentBlockLengthMode, churn, $scope.totalChurn, $scope.currentZoom).string;
        }
        // iterate over all commit blocks and
        chunkwiseLoop(0, length, /*chunksize=*/100, function(index) {
          $scope.individualBlocks[index].style.width = newWidths[index];
        });
      }


      // set colors for each metric that should be displayed
      angular.forEach(metricSelectionService.getSelectedMetrics(), function(value, key) {
        updateColors(value.id);
      });

      // register watches to trigger recomputations

      // the mapper might change when a new repo is added, and the
      // maxvalue increases
      $scope.$on('mapperChange', function (evnt, metricID, newMapper) {
        // TODO: support multiple metrics
        if (metricID === metricSelectionService.getSelectedMetrics()[0].id) {
          // only update visible metrics
          updateColors(metricID);
        }
      });

      $scope.oldZoom = zoomService.getSelectedZoom().num;

      $scope.$on('zoomChange', _.debounce(function (evnt, newZoom){
        // TODO: this function would be much cleaner if we had oldZoom in the
        // event
        // TODO: WARNING: this function does not call updateString for performance
        // reasons; this could lead to incorrect results
        // NOTE: the debounce is really important, else we get a terrible
        // performance
        if ($scope.oldZoom !== newZoom.num) {
          if ($scope.blenSelectionService.getSelectedBlenMod().id === "3_constant") {
            var scalingFactor = newZoom.num/$scope.oldZoom;
            $scope.oldZoom = newZoom.num;
            var length = $scope.repo.metricData[firstSelectedMetric.id].length;
            for (var j = 0; j < length; j++) {
              $scope.individualBlocks[j].style.width = parseInt($scope.individualBlocks[j].style.width) * scalingFactor;
            }
            $scope.$apply(); // code above never throws
          }
        } 
      }, 500));

      $scope.$watchCollection("metricSelectionService.getSelectedMetrics()", function(newVal) {
        console.log("newval", newVal);
        angular.forEach(newVal, function(value, key) {
          updateColors(value.id);
        });
      });

      $scope.$watch("blenSelectionService.getSelectedBlenMod()", function(newVal) {
        updateWidth(newVal.id);
      });
    }
  };
}]);

repogramsDirectives.directive('ngLegend', function(){ return {
	restrict: 'E',
	scope: {},
	template: '<div class="panel panel-success">' +
		  '<div class="panel-heading">'+
		  '<h3 class="panel-title">Legend</h3>'+
		  '</div>' +
                  '<div class="panel-body" ng-repeat="metric in selectedMetrics">'+
                  '<p><strong>{{metric.label}}</strong> <span>{{metric.description}}</span></p>'+
		  '<ul class="list-inline">' +
                  '<li ng-repeat="style in styles[metric.id]"><span class="customBlock" style="background-color: {{style.color}};"></span> {{style.legendText}}</li>' +
                  '</ul></div></div>',
	controller: ['$scope', 'reposService', 'metricSelectionService', function($scope, reposService, metricSelectionService){
          $scope.reposService = reposService;
          $scope.metricSelectionService = metricSelectionService;
          $scope.selectedMetrics = metricSelectionService.getSelectedMetrics();
          $scope.styles = {};
          angular.forEach(metricSelectionService.getAllMetrics(), function(value, index) {
            $scope.styles[value.id] = [];
          });

          $scope.$on("mapperChange", function(evnt, metricID, newMapper) {
            console.assert(angular.isDefined(newMapper), "new mapper is not defined!");
            var mappingInfo = newMapper.getMappingInfo();
            for (var i=0; i < mappingInfo.length; i++) {
              $scope.styles[metricID][i] = {
                color: mappingInfo[i].color,
                width: "10px",
                lowerBound: mappingInfo[i].lowerBound,
                upperBound: mappingInfo[i].upperBound,
                legendText: mappingInfo[i].legendText
              };
            }
          }, true);
	}]
};});
