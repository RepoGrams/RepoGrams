<?php
/**
 * Interface for accessing and querying reposa
 */
interface Repo_Interface 
{
	/**
	 * @return an array containing the name of all branches
	 */
	public function ListBraches();

	/**
	 * Changes the current branch to $branch
	 */
	public function SwitchToBranch($branch);

	/**
	 * @return a commit object, representing the first commit
	 */
	public function GetFirstCommit();

}
