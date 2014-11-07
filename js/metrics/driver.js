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
          if (data.precomputed === true) {
            callback(null, data.commit_lang_compl);
          } else {
            async.map(data.files, function(item, transformer) {
              transformer(/*err=*/null, commitLangCompl.run(item));
            }, callback);
          }
        },
        branch_complexity: function(callback) {
          callback(null, data.bcomplexities);
        },
        commit_message_length: function(callback) {
          if (data.precomputed === true) {
            callback(null, data.commit_message_length);
          } else {
            async.map(data.commit_messages, function(item, transformer) {
              transformer(/*err=*/null, commitMsgLength.run(item));
            }, callback);
          }
        },
        branch_usage: function(callback) {
          callback(null, data.associated_branches);
        },
        commit_modularity: function(callback) {
          if (data.precomputed === true) {
            callback(null, data.commit_modularity);
          } else {
            async.map(data.files, function(item, transformer) {
              transformer(/*err=*/null, commitModularity.run(item));
            }, callback);
          }
        },
        most_edited_file: function(callback) {
          if (data.precomputed === true) {
            callback(null, data.most_edit_file);
          } else {
            callback(null, mostEditFile.run(_.zip(data.churns, data.files)));
          }
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
