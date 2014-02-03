<?php
require_once __DIR__.'/../Repo.interface.php';
require_once 'SvnCommit.class.php';
require_once 'SvnImport.class.php';

class SvnRepo implements Repo_Interface {
	
	private $commits = array();

	/**
	 * @rawCommit the raw commit data
	 * @return a Commit object corresponding to the raw data
	 */
	private function rawCommit2Commit($rawCommit, $index) {
		return new SvnCommit(
			$index,
			NULL,
			NULL,
			isset($rawCommit["msg"]) ? $rawCommit["msg"] : "empty",
			isset($rawCommit["date"]) ? $rawCommit["date"] : "2004-01-02T22:39:18.000000Z",
			isset($rawCommit["author"]) ? $rawCommit["author"] : "John Doe"
		);
	}

	function __construct($url, $start=NULL, $end=NULL, &$datadir=NULL) {
		$SvnImporter = new SvnImport($url, $start, $end, $datadir);
		foreach ($SvnImporter->getRawRepoInfo() as $hash => $value) {
			if(isset($value["date"]) || isset($value["msg"]) || isset($value["author"])){
				$this->commits[] = $this->rawCommit2Commit($value, $hash);
				echo "";
			}
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
