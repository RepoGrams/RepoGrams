<?php
include __DIR__.'/../Commit.interface.php';

class SvnCommit implements Commit_Interface {

	private $pred;
	private $succ;
	private $msg;
	private $unix_time;
	private $diffToParent;
	private $author;

	function __construct($chksum, $pred, $succ, $msg, $unix_time, $author) {
		$this->chksum = $chksum;
		$this->pred = $pred;
		$this->succ = $succ;
		$this->msg = $msg;
		$this->unix_time = strtotime($unix_time);
		$this->author = $author;
		
		if(is_array($msg)){
			$this->msg = "";
		}
	         if(is_array($author)){
                        $this->author = "";
                }

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

	public function NumChangedLines() {
		return 5;
	}

	public function NumAddedLines() {
		return 5;
	}

	public function NumRemovedLines() {
		return 0;
	}
	public function Hash(){
		return $this->chksum;
	}
}

?>
