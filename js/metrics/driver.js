// TODO: this is still racy; it also causes 
var fileInfoForMetric1 = [];
jQuery.get("./js/metrics/filenames.json")
  .done(function(data){
   fileInfoForMetric1 = data;
   console.log("ready");
})
  .fail(function(jqXHR, textStatus, errorThrown) {console.log(textStatus);}) 
;


function runMetrics(data) {
  var commit_langcomp_data = [];
  var commit_msglength_data = [];
  var commit_modularity_data = [];
  var branch_complexity = [];
  var default_blen = [];
  var metric5data = data.map(function(commit_datum) {
    //metric 1
    commit_langcomp_data.push(getMetric(commit_datum.files, fileInfoForMetric1));
    // metric 2
    commit_msglength_data.push(commitMsgLength(commit_datum.commitmsg, commit_datum.churn));
    // metric 3
    commit_modularity_data.push(getMetrictCommitModularity(commit_datum.files));
    default_blen.push(commit_datum.churn);
    // metric 4: TODO: not sure if implementable
    // metric 5 work on all commits
    // metric 6 is computed server side, we just have to assign the value
    branch_complexity.push(commit_datum.bcomplexity);
    // return data for metric 5
    return [commit_datum.churn, commit_datum.files];
  });

  metric5data = mostEditFile(metric5data);
  console.log(metric5data);
  // WARNING: the member names have to match the names in metricSelectionService
  
  return {
    commit_lang_complexity: commit_langcomp_data,
    branch_complexity: branch_complexity,
    commit_message_length: commit_msglength_data,
    commit_modularity: commit_modularity_data,
    most_edit_file:  metric5data,
    defaultBlen: default_blen
  };
}
