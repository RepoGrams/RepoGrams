var repogramsServices = angular.module('repogramsServices', []);

repogramsServices.service('reposService', ['$rootScope', 'metricSelectionService', 'blockLengthSelectionService', function ($rootScope, metricSelectionService, blockLengthSelectionService) {
  var allRepositories = [];

  var toggleMultipleCommitVisibilities = function (repoIndex, commitIds) {
    if (commitIds.length) {
      var repository = allRepositories[repoIndex];
      commitIds.forEach(function (commitId) {
        if (repository.hiddenCommits.has(commitId)) {
          repository.hiddenCommits.delete(commitId);
        } else {
          repository.hiddenCommits.add(commitId);
        }
      });
      $rootScope.$broadcast('hiddenCommitsChange', repository);
    }
  };

  return {
    getAllRepositories: function () {
      return allRepositories;
    },
    getRepository: function (repoIndex) {
      return allRepositories[repoIndex];
    },
    getAllRepositoryUrls: function () {
      return allRepositories.map(function (repository) {
        return repository.url;
      });
    },
    addRepository: function (repository) {
      // Create an empty set to store the hidden commits
      repository.hiddenCommits = new Set();

      // Remove duplicates if there are any
      var duplicateIndex = -1;
      allRepositories.forEach(function (otherRepository, index) {
        if (otherRepository.url == repository.url) {
          duplicateIndex = index;

          // Copy the set of hidden commits from the duplicate repository to this one
          repository.hiddenCommits = otherRepository.hiddenCommits;
        }
      });
      if (duplicateIndex != -1) {
        this.removeRepository(duplicateIndex);
      }

      allRepositories.push(repository);
      $rootScope.$broadcast('reposChange', allRepositories);

      metricSelectionService.updateAllMetricMappers(allRepositories);
      blockLengthSelectionService.generateBaseLengthsForNewRepository(allRepositories, repository);
    },
    removeRepository: function (repoIndex) {
      allRepositories.splice(repoIndex, 1);
      $rootScope.$broadcast('reposChange', allRepositories);

      metricSelectionService.updateAllMetricMappers(allRepositories);
      blockLengthSelectionService.updateAllBlockLengths(allRepositories);
    },
    clear: function () {
      allRepositories.splice(0, allRepositories.length);
      $rootScope.$broadcast('reposChange', allRepositories);

      metricSelectionService.updateAllMetricMappers(allRepositories);
      blockLengthSelectionService.updateAllBlockLengths(allRepositories);
    },
    moveRepositoryUp: function (repoIndex) {
      if (repoIndex == 0)
        return;
      var tmp = allRepositories[repoIndex];
      allRepositories[repoIndex] = allRepositories[repoIndex - 1];
      allRepositories[repoIndex - 1] = tmp;
      $rootScope.$broadcast('reposChange', allRepositories);
    },
    moveRepositoryDown: function (repoIndex) {
      if (repoIndex == allRepositories.length - 1)
        return;
      var tmp = allRepositories[repoIndex];
      allRepositories[repoIndex] = allRepositories[repoIndex + 1];
      allRepositories[repoIndex + 1] = tmp;
      $rootScope.$broadcast('reposChange', allRepositories);
    },
    getAllHiddenCommits: function () {
      return allRepositories.map(function (repository) {
        var commitIds = [];
        repository.hiddenCommits.forEach(function (commitId) {
          commitIds.push(commitId);
        });
        return commitIds;
      });
    },
    anyHiddenCommits: function () {
      return allRepositories.some(function (repository) {
        return repository.hiddenCommits.size;
      });
    },
    toggleCommitVisibility: function (repoIndex, commitId) {
      toggleMultipleCommitVisibilities(repoIndex, [commitId]);
    },
    toggleMultipleCommitVisibilities: toggleMultipleCommitVisibilities
  };
}]);

repogramsServices.service('metricSelectionService', ['$rootScope', function ($rootScope) {
  var selectedMetricIds = [];
  var isMetricsFirst = true;

  var getAllValues = function (metricId, allRepositories) {
    var allValues = [];
    for (var i = 0; i < allRepositories.length; i++) {
      allValues = allValues.concat(allRepositories[i].metricData[metricId]);
    }
    return allValues;
  };

  var swapMultipleMetrics = function (metricIds) {
    metricIds.forEach(function (metricId) {
      var position = selectedMetricIds.indexOf(metricId);
      if (position == -1) {
        selectedMetricIds.push(metricId);
      } else {
        selectedMetricIds.splice(position, 1);
      }
    });
    $rootScope.$broadcast('selectedMetricsChange');
  };

  return {
    getSelectedMetricIds: function () {
      return selectedMetricIds;
    },
    getSelectedMetricObjects: function () {
      var selectedMetricObjects = {};
      selectedMetricIds.forEach(function (metricId) {
        selectedMetricObjects[metricId] = Metrics[metricId];
      });
      return selectedMetricObjects;
    },
    swapMetric: function (metricId) {
      swapMultipleMetrics([metricId]);
    },
    swapMultipleMetrics: swapMultipleMetrics,
    isMetricSelected: function (metricId) {
      return selectedMetricIds.indexOf(metricId) != -1;
    },
    clear: function () {
      for (var i = 0; i < selectedMetricIds.length; i++) {
        Metrics[selectedMetricIds[i]].selected = false;
      }
      selectedMetricIds.length = 0;
      $rootScope.$broadcast('selectedMetricsChange');
    },
    isMetricsFirst: function () {
      return isMetricsFirst;
    },
    setIsMetricsFirst: function (value) {
      isMetricsFirst = value;
      $rootScope.$broadcast('multiMetricModeChange');
    },
    updateAllMetricMappers: function (allRepositories) {
      for (var metricId in Metrics) {
        if (Metrics.hasOwnProperty(metricId)) {
          var mapper = Metrics[metricId].mapper;
          if (mapper.updateMappingInfo(getAllValues(metricId, allRepositories))) {
            $rootScope.$broadcast('mapperChange', metricId, mapper);
          }
        }
      }
    }
  };
}]);

repogramsServices.service('blockLengthSelectionService', ['$rootScope', 'zoomService', function ($rootScope, zoomService) {
  var blockLengthModesOrder = ['fixed', 'linear', 'logarithmic'];
  var allBlockLengthModes = {
    'fixed': {
      label: "Fixed",
      icon: 'icon-block-length-fixed',
      description: "All blocks have constant width.",
      calculateBase: function (churn) {
        return 5;
      }
    },
    'linear': {
      label: "Linear",
      icon: 'icon-block-length-linear',
      description: "Block width is scaled linearly according to the number of lines of code changed per commit.",
      calculateBase: function (churn) {
        return churn;
      }
    },
    'logarithmic': {
      label: "Logarithmic",
      icon: 'icon-block-length-logarithmic',
      description: "Block width is scaled logarithmically according to the number of lines of code changed per commit.",
      calculateBase: function (churn) {
        return Math.ceil(Math.log2(churn + 1));
      }
    }
  };

  var normalizationModesOrder = ['global', 'project'];
  var allNormalizationModes = {
    'global': {
      label: "Globally normalized",
      icon: 'fa fa-align-left',
      description: "Commit block width is normalized across projects and is therefore comparable between projects.",
      calculateWidth: function (baseWidth, totalBaseWidth, maxTotalBaseWidth, zoom) {
        return maxTotalBaseWidth > 0 ? (100 * zoom * baseWidth / maxTotalBaseWidth) + '%' : 0;
      }
    },
    'project': {
      label: "Project normalized",
      icon: 'fa fa-align-justify',
      description: "Commit block widths are incomparable between projects but are comparable within the same project. Widths are selected so that each project fills the screen.",
      calculateWidth: function (baseWidth, totalBaseWidth, maxTotalBaseWidth, zoom) {
        return totalBaseWidth > 0 ? (100 * zoom * baseWidth / totalBaseWidth) + '%' : 0;
      }
    }
  };

  var selectedBlockLengthModeId = 'linear';
  var selectedNormalizationModeId = 'project';

  var updateAllBlockLengths = function (allRepositories) {

    // Find the maximum total base width and retrieve the zoom value
    var maxTotalBaseWidth = 0;
    allRepositories.forEach(function (repository) {
      maxTotalBaseWidth = Math.max(maxTotalBaseWidth, repository.totalBaseWidths[selectedBlockLengthModeId]);
    });
    var zoom = zoomService.getSelectedZoom();

    // For each repository find the real width values based on the selected normalization mode
    allRepositories.forEach(function (repository) {
      var widths = [];
      var selectedNormalizationMode = allNormalizationModes[selectedNormalizationModeId];
      var totalBaseWidth = repository.totalBaseWidths[selectedBlockLengthModeId];

      for (var i = 0; i < repository.metricData.churns.length; i++) {
        var baseWidth = repository.baseWidths[selectedBlockLengthModeId][i];
        widths.push(selectedNormalizationMode.calculateWidth(baseWidth, totalBaseWidth, maxTotalBaseWidth, zoom));
      }

      repository.widths = widths;
    });

    $rootScope.$broadcast('blockLengthsChange');
  };

  return {
    getSelectedBlockLengthModeId: function () {
      return selectedBlockLengthModeId;
    },
    getSelectedNormalizationModeId: function () {
      return selectedNormalizationModeId;
    },
    getAllBlockLengthModes: function () {
      return allBlockLengthModes;
    },
    getBlockLengthModesOrder: function () {
      return blockLengthModesOrder;
    },
    getAllNormalizationModes: function () {
      return allNormalizationModes;
    },
    getNormalizationModesOrder: function () {
      return normalizationModesOrder;
    },
    setBlockLengthModes: function (newBlockLengthModeId, newNormalizationModeId) {
      selectedBlockLengthModeId = newBlockLengthModeId;
      selectedNormalizationModeId = newNormalizationModeId;
      $rootScope.$broadcast('blockLengthModeChange', selectedBlockLengthModeId, selectedNormalizationModeId);
    },
    generateBaseLengthsForNewRepository: function (allRepositories, changedRepository) {
      var baseWidths = {};
      var totalBaseWidths = {};

      for (var blockLengthModeId in allBlockLengthModes) {
        if (allBlockLengthModes.hasOwnProperty(blockLengthModeId)) {
          var blockLengthMode = allBlockLengthModes[blockLengthModeId];
          baseWidths[blockLengthModeId] = [];
          totalBaseWidths[blockLengthModeId] = 0;

          for (var i = 0; i < changedRepository.metricData.churns.length; i++) {
            var width = 0;
            var churn = changedRepository.metricData.churns[i];
            var commitId = changedRepository.metricData.checksums[i];

            if (!changedRepository.hiddenCommits.has(commitId)) {
              width = blockLengthMode.calculateBase(churn);
            }

            baseWidths[blockLengthModeId].push(width);
            totalBaseWidths[blockLengthModeId] += width;
          }
        }
      }

      changedRepository.baseWidths = baseWidths;
      changedRepository.totalBaseWidths = totalBaseWidths;

      updateAllBlockLengths(allRepositories);
    },
    updateAllBlockLengths: updateAllBlockLengths
  };
}]);

repogramsServices.service('zoomService', ['$rootScope', function ($rootScope) {
  var selectedZoom = 1;

  return {
    getSelectedZoom: function () {
      return selectedZoom;
    },
    setZoom: function (newZoom) {
      _.debounce(function () {
        selectedZoom = newZoom;
        $rootScope.$broadcast('zoomChange');
      }, 200)();
    }
  };
}]);
