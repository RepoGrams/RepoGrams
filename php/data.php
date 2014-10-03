<?php
error_reporting(-1);
$data = json_decode(file_get_contents("php://input"));
$command = "/usr/bin/python2 ../scripts/git_graph.py ".$data->repourl;
error_log($command);
exec($command, $output, $retcode);
if ($retcode !== 0) {
  http_response_code(400);
}
echo implode($output);
return;
?>
