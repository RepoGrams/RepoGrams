<?php
interface Changes{
	// returns the number of files that were changed in current commit
	public function getNoFilesChanged();

	// returns the number of lines added in current commit
        public function getLinesAdded();

	// returns the number of lines deleted in current commit
        public function getLinesDeleted();

	// returns a array containing the filenames (with relative folder) of affected files
        public function getFilesAffected();
}
?>
