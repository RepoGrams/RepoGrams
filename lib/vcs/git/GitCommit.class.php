<?php

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
		if ($pred === NULL) {
			throw Exception("No Predecessor");
		}
		return $pred;
	}

	public function Successor() {
		if ($succ === NULL) {
			throw Exception("No Successor");
		}
		return $succ;
	}

	public function CommitMessage() {
		return $msg;
	}

	public function CommitTime() {
		return $unix_time;
	}

	public function DiffToParent() {
		throw Exception("NOT IMPLEMENTED");
	}

}

?>
