function commitMsgLength(commitMsgs, commitSize){ // array of all commit messages, array of number of changes
	var output = new Array(commitMsgs.length);
	for (var i = 0; i < commitMsgs.length; i++){
		var commit = new Array(2);
		commit[0] = commitSize[i];
		var commitMsg = commitMsgs[i];
		commitMsg.trim();
		var length = commitMsg.split(" ").length;
		commit[1] = length;
		output[i] = commit;
	}
	return output; // returns all commit messages length with number of changes in this commit
}