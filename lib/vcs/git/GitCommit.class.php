<?php
include './../Commit.interface.php';

class GitCommit implements Commit_Interface {

	private $pred;
	private $succ;
	private $msg;
	private $unix_time;
	private $diffToParent;

	function __construct($chksum, $pred, $succ, $msg, $unix_time, $diffToParent) {
		$this->chksum = $chksum;
		$this->pred = $pred;
		$this->succ = $succ;
		$this->msg = $msg;
		$this->unix_time = $unix_time;
		$this->diffToParent = $diffToParent;
	}

	public function Predecessor() {
		if (isset($this->pred) && !is_null($this->pred)) {
			throw Exception("No Predecessor");
		}
		return $this->pred;
	}

	public function Successor() {
		if (isset($this->succ) && !is_null($this->succ)) {
			throw Exception("No Successor");
		}
		return $this->succ;
	}

	public function CommitMessage() {
		return $this->msg;
	}

	public function CommitTime() {
		return $this->unix_time;
	}

	public function DiffToParent() {
		throw Exception("NOT IMPLEMENTED");
	}

	public function NumChangedLines() {
		return ($this->diffToParent->getLinesAdded() + $this->diffToParent->getLinesDeleted());
	}

	public function NumAddedLines() {
		return $this->diffToParent->getLinesAdded();
	}

	public function NumRemovedLines() {
		return $this->diffToParent->getLinesDeleted();
	}
}

?>
