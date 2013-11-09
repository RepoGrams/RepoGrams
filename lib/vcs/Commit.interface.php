<?php

/**
 * Interface describing a commit object
 */

interface  Commit_Interface {
	/**
	 * @return the previous commit
	 */
	function Predecessor();

	/**
	 * @return the next commit
	 */
	function Successor();

	/**
	 * @return the commit message
	 */
	function CommitMessage();

	/**
	 * @return the time of the commit
	 */
	function CommitTime()
	
	/**
	 * @return the diff to the parent
	 */
	function DiffToParent();

	// everything else we need
}
