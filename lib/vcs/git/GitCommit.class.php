<?php
require_once __DIR__.'/../Commit.interface.php';

class GitCommit implements Commit_Interface {
	private $chksum;
	private $pred;
	private $succ;
	private $msg;
	private $unix_time;
	private $diffToParent;
	private $author;

	function __construct($chksum, $pred, $succ, $msg, $unix_time, $diffToParent, $author) {
		$this->chksum = $chksum;
		$this->pred = $pred;
		$this->succ = $succ;
		$this->msg = $msg;
		$this->unix_time = $unix_time;
		$this->diffToParent = $diffToParent;
		$this->author = $author;
	}

	public function Predecessor() {
		if (isset($this->pred) && !is_null($this->pred)) {
			throw new Exception("No Predecessor");
		}
		return $this->pred;
	}

	public function Successor() {
		if (isset($this->succ) && !is_null($this->succ)) {
			throw new Exception("No Successor");
		}
		return $this->succ;
	}

	public function CommitMessage() {
		return $this->msg;
	}

	public function CommitAuthor() {
		return $this->author;
	}

	public function CommitTime() {
		return $this->unix_time;
	}

	public function DiffToParent() {
		throw new Exception("NOT IMPLEMENTED");
	}

	public function Hash(){
		return $this->chksum;
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
