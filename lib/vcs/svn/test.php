<?php
require('SvnImport.class.php');
require('SvnRepo.class.php');

$test = new SvnRepo("http://nikon-camera-control.googlecode.com/svn/trunk/");

echo nl2br( "ListBranches: \n");
print_r	($test->ListBranches());
echo nl2br( "\n\n GetTotalCommitCount: \n");
print_r ($test->GetTotalCommitCount());
echo nl2br( "\n\n getFirstCommit: \n");
$first = $test->getFirstCommit();
echo nl2br( "\t\t Predecessor:");
print_r($first->Predecessor());
echo nl2br( "\n\t\t Successor:");
print_r($first->Successor());
echo nl2br( "\n\t\t CommitMessage:");
print_r($first->CommitMessage());
echo nl2br( "\n\t\t CommitAuthor:");
print_r($first->CommitAuthor());
echo nl2br( "\n\t\t CommitTime:");
print_r($first->CommitTime());
echo nl2br( "\n\t\t NumChangedLines:");
print_r($first->NumChangedLines());
echo nl2br( "\n\t\t NumAddedLines:");
print_r($first->NumAddedLines());
echo nl2br( "\n\t\t NumRemovedLines:");
print_r($first->NumRemovedLines());
echo nl2br( "\n\n\nAll Commits:\n");
foreach($test->getAllCommits() as $first){
	echo nl2br( "\t\t Predecessor:");	
	print_r($first->Predecessor());
	echo nl2br( "\n\t\t Successor:");
	print_r($first->Successor());
	echo nl2br( "\n\t\t CommitMessage:");
	print_r($first->CommitMessage());
	echo nl2br( "\n\t\t CommitTime:");
	print_r($first->CommitTime());
	echo nl2br( "\n\t\t NumChangedLines:");
	print_r($first->NumChangedLines());
	echo nl2br( "\n\t\t NumAddedLines:");
	print_r($first->NumAddedLines());
	echo nl2br( "\n\t\t NumRemovedLines:");
	print_r($first->NumRemovedLines());
	echo nl2br( "\n\n");
}




	
