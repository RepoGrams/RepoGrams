angular.module('repogramsModule').factory('metricsRunner', ['commitModularity', 'commitMsgLength', 'commitLangCompl', 'mostEditFile', function(commitModularity, commitMsgLength, commitLangCompl, mostEditFile) {
  return {
    runMetricsAsync: function(data, onComplete) {
      async.parallel({
        checksums: function(callback) {
                callback(null, data.checksums);
        },
        commit_msgs: function(callback) {
          callback(null, data.commit_messages);
        },
        commit_lang_complexity: function(callback) {
          async.map(data.files, function(item, transformer) {
            transformer(/*err=*/null, commitLangCompl.run(item));
          }, callback);
        },
        branch_complexity: function(callback) {
          callback(null, data.bcomplexities);
        },
        commit_message_length: function(callback) {
          async.map(data.commit_messages, function(item, transformer) {
            transformer(/*err=*/null, commitMsgLength.run(item));
          }, callback);
        },
        branch_usage: function(callback) {
          callback(null, data.associated_branches);
        },
        commit_modularity: function(callback) {
          async.map(data.files, function(item, transformer) {
            transformer(/*err=*/null, commitModularity.run(item));
          }, callback);
        },
        most_edited_file: function(callback) {
          callback(null, mostEditFile.run(_.zip(data.churns, data.files)));
        },
        churn: function(callback) {
          callback(null, data.churns);
        },
      }, function(err, results) {
        onComplete(results);
      });
    }
  };
}]);
