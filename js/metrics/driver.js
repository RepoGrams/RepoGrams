angular.module('repogramsModule').factory('metricsRunner', ['commitModularity', 'commitMsgLength', 'commitLangCompl', function(commitModularity, commitMsgLength, commitLangCompl) {
  return {
    runMetrics:  function(data) {
      var commit_langcomp_data = [];
      var checksums = [];
      var commit_msglength_data = [];
      var commit_modularity_data = [];
      var branch_usage_data = [];
      var branch_complexity = [];
      var commit_msgs = [];
      var churn = [];
      var metric5data = data.map(function(commit_datum) {
        // we need to display commit message later
        commit_msgs.push(commit_datum.commitmsg);
        // as well as the commit id aka hashsum
        checksums.push(commit_datum.checksum);
        //metric 1
        commit_langcomp_data.push(commitLangCompl.run(commit_datum.files));
        // metric 2
        commit_msglength_data.push(commitMsgLength.run(commit_datum.commitmsg, commit_datum.churn));
        // metric 3
        commit_modularity_data.push(commitModularity.run(commit_datum.files));
        churn.push(commit_datum.churn);
        // metric 4
        branch_usage_data.push(commit_datum.associated_branch);
        // metric 5 work on all commits
        // metric 6 is computed server side, we just have to assign the value
        branch_complexity.push(commit_datum.bcomplexity);
        // return data for metric 5
        return [commit_datum.churn, commit_datum.files];
      });

      metric5data = mostEditFile(metric5data);
      // WARNING: the member names have to match the names in metricSelectionService

      return {
        commit_msgs: commit_msgs,
        commit_lang_complexity: commit_langcomp_data,
        branch_complexity: branch_complexity,
        commit_message_length: commit_msglength_data,
        branch_usage: branch_usage_data,
        commit_modularity: commit_modularity_data,
        most_edit_file:  metric5data,
        churn: churn,
      };
    }
  };
}]);
