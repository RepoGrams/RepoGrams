function commitMsgLength(commitMsg, commitSize){ // array of all commit messages, array of number of changes
	var length = commitMsg.trim().split(" ").length;
	return [commitSize, length] ; // returns all commit messages length with number of changes in this commit
}
