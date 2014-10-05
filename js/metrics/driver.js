angular.module('repogramsModule').factory('metricsRunner', ['commitModularity', 'commitMsgLength', 'commitLangCompl', 'mostEditFile', function(commitModularity, commitMsgLength, commitLangCompl, mostEditFile) {
  return {
    runMetrics:  function(data) {
      var commit_langcomp_data = data.files.map(commitLangCompl.run);
      var commit_msglength_data = data.commit_messages.map(commitMsgLength.run);
      var metric5data = mostEditFile.run(_.zip(data.churns, data.files));
      var commit_modularity_data = data.files.map(commitModularity.run);

      // WARNING: the member names have to match the names in metricSelectionService

      var result = {
        checksums: data.checksums,
        commit_msgs: data.commit_messages,
        commit_lang_complexity: commit_langcomp_data,
        branch_complexity: data.bcomplexities,
        commit_message_length: commit_msglength_data,
        branch_usage: data.associated_branches,
        commit_modularity: commit_modularity_data,
        most_edit_file:  metric5data,
        churn: data.churns,
      };
      console.log(result);
      return result;
    }
  };
}]);
