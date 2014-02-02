<?php
error_reporting(-1);
if (session_id() == '') session_start();
require_once(__DIR__."/../lib/vcs/git/GitChanges.class.php");
require_once(__DIR__."/../lib/vcs/git/GitCommit.class.php");

############################### Function preprocess ############################
##### convert into array of expected order                                                              #####
##### Input: Object of Commit Interface                                                                 #####
##### Output: array with commit message, number of changed lines, author, time for all commits #####
############################################################################################################# 

function preprocess($obj){

  require_once(__DIR__."/../lib/vcs/Commit.interface.php");
  for ($i = 0; $i < count($obj); $i++){
    $array[$i] = array($obj[$i]->CommitMessage(), $obj[$i]->NumChangedLines(), $obj[$i]->CommitAuthor(), $obj[$i]->CommitTime()) ;
  }
  return $array;
}

function dumpRepoAsJSON() {
        $repo = preprocess(unserialize($_SESSION['repo']));
        return json_encode($repo);
        //return json_encode($repo, JSON_UNESCAPED_UNICODE);
}

error_log("=================================");
header("Content-Type: application/json");
echo(dumpRepoAsJSON());
die();

?>
