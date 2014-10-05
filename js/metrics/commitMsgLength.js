angular.module('repogramsModule').factory('commitMsgLength', [function() {
  function commitMsgLength(commitMsg){ // array of all commit messages, array of number of changes
    var length = commitMsg.trim().split(" ").length;
    return length ; // returns all commit messages length with number of changes in this commit
  }
  return {
    "run": commitMsgLength
  };
}]);
