function runMetrics(data) {
  var commit_langcomp_data = [];
  var commit_msglength_data = [];
  var commit_modularity_data = [];
  var metric5data = data.map(function(commit_datum) {
    //metric 1
    commit_langcomp_data.push(getMetric(commit_datum.files))
    // metric 2
    commit_msglength_data.push(commitMsgLength(commit_datum.commitmsg, commit_datum.churn));
    // metric 3
    commit_modularity_data.push(getMetrictCommitModularity(commit_datum.files));
    // metric 4: TODO: not sure if implementable
    // metric 5 work on all commits
    // metric 6 is computed server side
    // return data for metric 5
    return [commit_datum.churn, commit_datum.files];
  });

  var metric5data = mostEditFile(metric5data);
  console.log("alive");
  return {
    languageComplexityData: commit_langcomp_data,
    msglengthData: commit_msglength_data,
    modularityData: commit_modularity_data,
    mostEditFileData:  metric5data
  }
}
