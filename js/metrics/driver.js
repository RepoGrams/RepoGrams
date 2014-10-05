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
          async.map(data, function(item, transformer) {
            transformer(/*err=*/null, commitLangCompl.run(item));
          }, callback);
        },
        branch_complexity: function(callback) {
          callback(null, data.bcomplexities);
        },
        commit_message_length: function(callback) {
          callback(null,data.commit_messages.map(commitMsgLength.run));
        },
        branch_usage: function(callback) {
          callback(null, data.associated_branches);
        },
        commit_modularity: function(callback) {
          callback(null, data.files.map(commitModularity.run));
        },
        most_edit_file: function(callback) {
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
