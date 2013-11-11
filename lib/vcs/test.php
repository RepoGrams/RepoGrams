<?php
$output = exec("cd /var/www/ && git log --pretty='{%n \"commit\": \"%H\",%n \"author\": \"%an <%ae>\",%n \"date\": \"%ad\",%n \"message\": \"%s\"%n\},'");
echo "Output:";
print_r($output);
$output = rtrim($output,',');
$output = '['.$output.']';
$output_array = array();
$output_array =json_encode($output);
print_r($output_array);
?>

