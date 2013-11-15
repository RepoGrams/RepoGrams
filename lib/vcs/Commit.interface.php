<?php

/**
 * Interface describing a commit object
 */

interface  Commit_Interface {
	/**
	 * @return the previous commit
	 * @throws if there is no predecessor
	 */
	function Predecessor();

	/**
	 * @return the next commit
	 * @throws if there is no successor 
	 */
	function Successor();

	/**
	 * @return the commit message
	 */
	function CommitMessage();

	/**
	 * @return the time of the commit
	 */
	function CommitTime();
	
	/**
	 * @return the diff to the parent
	 * @throws if there is no such diff
	 */
	function DiffToParent();

	// everything else we need
}
