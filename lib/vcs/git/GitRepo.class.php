<?php
require_once __DIR__.'/../Repo.interface.php';
require_once 'GitCommit.class.php';
require_once 'GitImport.class.php';
require_once 'GitChanges.class.php';

class GitRepo implements Repo_Interface {
	
	private $commits = array();

	/**
	 * @rawCommit the raw commit data
	 * @return a Commit object corresponding to the raw data
	 */
	private function rawCommit2Commit($rawCommit, $index) {
		return new GitCommit(
			$index,
			NULL,
			NULL,
			$rawCommit["message"],
			$rawCommit["date"],
			new GitChanges($rawCommit["changes"]),
			$rawCommit["author"]
		);
	}

	function __construct($url, $start, $end) {
		$gitImporter = new gitImport($url, $start, $end);
		foreach ($gitImporter->getRawRepoInfo() as $hash => $value) {
			$this->commits[] = $this->rawCommit2Commit($value, $hash);
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
		return end($this->commits);
	}

	public function GetAllCommits() {
		return $this->commits;
	}

	public function GetTotalCommitCount(){
		return count($this->commits);
	}

}

?>
