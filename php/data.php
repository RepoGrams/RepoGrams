<?php
error_reporting(-1);
$data = json_decode(file_get_contents("php://input"));
$command = "/usr/bin/python2 ../scripts/git_graph.py ".$data->repourl;
error_log($command);
$output = shell_exec($command);
echo $output;
return;
?>
