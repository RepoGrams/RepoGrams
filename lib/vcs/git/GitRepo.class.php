<?php
require_once "GitCommit.class.php";
require_once "GitImport.class.php";

class GitRepo implements Repo_Interface {
	
	private $commits = array();

	/**
	 * @rawCommit the raw commit data
	 * @return a Commit object corresponding to the raw data
	 */
	private function rawCommit2Commit($rawCommit, $index) {
		return new GitCommit(
			index,
			NULL,
			NULL,
			$rawCommit["message"],
			$rawCommit["date"],
			NULL
		);
	}

	function __construct($url) {
		$gitImporter = new gitImport($url);
		foreach (GitImporter::getRawRepoInfo() as $hash => $value) {
			$commits[] = rawCommit2Commit($value, $hash);
		}
	}

	public function ListBranches() {
		return array("master");	
	}

	public function SwitchToBranch($branch) {
		throw new BadMethodCallException();
	}

	public function GetFirstCommit() {
		// git log uses reverse order
		// therefore the first commit is at the end of the array
		return $this->rawCommit2Commit(end($rawData));
	}

	public function GetAllCommits() {
		return $this->commits;
	}

}

?>
