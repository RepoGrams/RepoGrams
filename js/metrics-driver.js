angular.module('repogramsModule').factory('metricsRunner', ['commitModularity', 'commitMsgLength', 'commitLangCompl', 'mostEditFile', function (commitModularity, commitMsgLength, commitLangCompl, mostEditFile) {
  return {
    runMetricsAsync: function (data, onComplete) {
      async.parallel({
        checksums: function (callback) {
          callback(null, data.checksums);
        },
        commit_msgs: function (callback) {
          callback(null, data.commit_messages);
        },
        commit_lang_complexity: function (callback) {
          callback(null, data.commit_lang_compl);
        },
        branch_complexity: function (callback) {
          callback(null, data.bcomplexities);
        },
        commit_message_length: function (callback) {
          callback(null, data.commit_message_length);
        },
        branch_usage: function (callback) {
          callback(null, data.associated_branches);
        },
        commit_modularity: function (callback) {
          callback(null, data.commit_modularity);
        },
        most_edited_file: function (callback) {
          callback(null, data.most_edit_file);
        },
        churn: function (callback) {
          callback(null, data.churns);
        },
        pom_files: function (callback) {
          callback(null, data.pom_files);
        },
        files_modified: function (callback) {
          callback(null, data.files_modified);
        },
        merge_indicator: function (callback) {
          callback(null, data.merge_indicator);
        },
        author_experience: function (callback) {
          callback(null, data.author_experience);
        },
        commit_author: function (callback) {
          callback(null, data.commit_author);
        },
        commit_age: function (callback) {
          callback(null, data.commit_age);
        }
      }, function (err, results) {
        onComplete(results);
      });
    }
  };
}]);
