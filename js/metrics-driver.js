angular.module('repogramsModule').factory('metricsRunner', function () {
  return {
    runMetricsAsync: function (data, onComplete) {
      var tasks = {};
      for (var elm in data) {
        if (data.hasOwnProperty(elm)) {
          tasks[elm] = (function(elm) {
            return function (callback) {
              callback(null, data[elm]);
            }
          })(elm);
        }
      }

      async.parallel(tasks, function (err, results) {
        onComplete(results);
      });
    }
  };
});
