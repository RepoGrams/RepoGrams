angular.module('repogramsModule').factory('commitMsgLength', [function () {
  function commitMsgLength(commitMsg) { // array of all commit messages, array of number of changes
    var trimmedMsg = commitMsg.trim();
    var matches = trimmedMsg.match(/\s+/gm);
    if (matches) {
      return matches.length + 1;
    } else if (trimmedMsg) {
      return 1;
    } else {
      return 0;
    }
  }

  return {
    "run": commitMsgLength
  };
}]);
