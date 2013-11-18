<?php
require_once('./../Changes.interface.php');

class Change{
	private $added, $removed, $filename;
	function __construct($added,$removed,$filename){
		$this->added = $added;
		$this->removed = $removed;
		$this->filename = $filename;
	}
		public function getAdded(){
		return $this->added;
	}
		public function getRemoved(){
		return $this->removed;
	}
		public function getFilename(){
		return $this->filename;
	}
}

class GitChanges implements Changes{
	private $changes = array();

	function __construct($changesString){
		preg_match_all('^([0-9]*)\t([0-9]*)\t(.*)\n^',$changesString,$matches,PREG_SET_ORDER);
		foreach($matches as $match){
			$this->changes[] = new Change($match[1],$match[2],$match[3]);
		}
	}

	public function getNoFilesChanged(){
		return count($this->changes);
	}

	public function getLinesAdded(){
		$sum = 0;
		foreach($this->changes as $change){
			$sum = $sum + $change->getAdded();
		}
		return $sum;
	}

	public function getLinesDeleted(){
		$sum = 0;
		foreach($this->changes as $change){
			$sum = $sum + $change->getRemoved();
		}
		return $sum;
	}

	public function getFilesAffected(){
		$files = array();
		foreach($this->changes as $change){
			$files[] = $change->getFilename();
		}
		return $files;
	}

}
?>
