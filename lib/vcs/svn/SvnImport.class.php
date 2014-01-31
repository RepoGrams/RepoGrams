<?php
error_reporting(-1);
require_once __DIR__.'/../RepoImporter.class.php';

class SvnImport extends RepoImporter {
	private $RepoObject;

	public function __construct($repo, $start, $end, &$datadir=NULL) { //,$user=null,$password=null){
		
		if (($this->is_valid_url($repo) === false)){
			// die("<h1>Possible injection detected</h1>");
			error_log("Injection detected: $repo");
			throw new Exception("Invalid URL!");	
			return 0;
		}	
		$range = "";
		if (!is_null($start) || !is_null($end)){
			$from = ""; 
			$to = "";
			if (is_null($start)){$from = date("Y-m-d",0);} else {$from = date("Y-m-d",strtotime($start));}
			if (is_null($end)){$to = date("Y-m-d",time());} else {$to = date("Y-m-d",strtotime($end));}
			$range =' -r {'.$from.'}:{'.$to.'}'; 
		}

		$command = "svn log --xml ".$repo.$range;
                error_log($command);
		$output = shell_exec($command);
		$output_array = $this->xml2array($output);
		if (is_null($output_array)) {
			error_log("stop");
		}
		$this->RepoObject = $output_array['log']['logentry'];
	}

	
  
  /* Verify the syntax of the given URL.
  *
  * @access public
  * @param $url The URL to verify.
  * @return boolean
  */

private function is_valid_url($url) {
   if ($this->str_starts_with(strtolower($url), 'http://localhost')) {
     return true;
   }
   return preg_match('/^(http?):\/\/'.                                         // protocol
'(([a-z0-9$_\.\+!\*\'\(\),;\?&=-]|%[0-9a-f]{2})+'.         // username
'(:([a-z0-9$_\.\+!\*\'\(\),;\?&=-]|%[0-9a-f]{2})+)?'.      // password
'@)?(?#'.                                                  // auth requires @
')((([a-z0-9]\.|[a-z0-9][a-z0-9-]*[a-z0-9]\.)*'.           // domain segments AND
'[a-z][a-z0-9-]*[a-z0-9]'.                                 // top level domain  OR
'|((\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.){3}'.
'(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])'.                 // IP address
')(:\d+)?'.                                                // port
')(((\/+([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)*'. // path
'(\?([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)'.      // query string
'?)?)?'.                                                   // path and query string optional
'(#([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)?'.      // fragment
'$/i', $url);
}


/**
  * String starts with something
  *
  * This function will return true only if input string starts with
  * niddle
  *
  * @param string $string Input string
  * @param string $niddle Needle string
  * @return boolean
  */
	private function str_starts_with($string, $niddle) {
	       	return substr($string, 0, strlen($niddle)) == $niddle;
	}	
	
	public function getRawRepoInfo(){
		if (isset($this->RepoObject) && !is_null($this->RepoObject))
			return $this->RepoObject;
		else
			throw new Exception("Fetching SvnObject was not sucessfull");
	}
	
/** Function copied from http://php.net/manual/en/function.xml-parse.php
  * altered for taking string instead of url
  * 
  * takes: 	$string containing xml-data
  * 		
  */
	private function xml2array($contents, $get_attributes = 1, $priority = 'tag'){
	    if (!function_exists('xml_parser_create'))
	    {
	        error_log("XML Parser Error!!");
		return array ();
	    }
	    $parser = xml_parser_create('');
	    xml_parser_set_option($parser, XML_OPTION_TARGET_ENCODING, "UTF-8");
	    xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, 0);
	    xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, 1);
	    xml_parse_into_struct($parser, trim($contents), $xml_values);
	    xml_parser_free($parser);
	    if (!$xml_values)
	        return; //Hmm...
	    $xml_array = array ();
	    $parents = array ();
	    $opened_tags = array ();
	    $arr = array ();
	    $current = & $xml_array;
	    $repeated_tag_index = array ();
	    foreach ($xml_values as $data)
	    {
	        unset ($attributes, $value);
	        extract($data);
	        $result = array ();
	        $attributes_data = array ();
	        if (isset ($value))
	        {
	            if ($priority == 'tag')
	                $result = $value;
	            else
	                $result['value'] = $value;
	        }
	        if (isset ($attributes) and $get_attributes)
	        {
	            foreach ($attributes as $attr => $val)
	            {
	                if ($priority == 'tag')
	                    $attributes_data[$attr] = $val;
	                else
	                    $result['attr'][$attr] = $val; //Set all the attributes in a array called 'attr'
	            }
	        }
	        if ($type == "open")
	        {
	            $parent[$level -1] = & $current;
	            if (!is_array($current) or (!in_array($tag, array_keys($current))))
        	    {
	                $current[$tag] = $result;
	                if ($attributes_data)
	                    $current[$tag . '_attr'] = $attributes_data;
	                $repeated_tag_index[$tag . '_' . $level] = 1;
	                $current = & $current[$tag];
	            }
	            else
	            {
	                if (isset ($current[$tag][0]))
	                {
	                    $current[$tag][$repeated_tag_index[$tag . '_' . $level]] = $result;
	                    $repeated_tag_index[$tag . '_' . $level]++;
	                }
	                else
	                {
	                    $current[$tag] = array (
	                        $current[$tag],
	                        $result
	                    );
	                    $repeated_tag_index[$tag . '_' . $level] = 2;
	                    if (isset ($current[$tag . '_attr']))
	                    {
	                        $current[$tag]['0_attr'] = $current[$tag . '_attr'];
	                        unset ($current[$tag . '_attr']);
	                    }
	                }
	                $last_item_index = $repeated_tag_index[$tag . '_' . $level] - 1;
	                $current = & $current[$tag][$last_item_index];
	            }
	        }
	        elseif ($type == "complete")
	        {
	            if (!isset ($current[$tag]))
	            {
	                $current[$tag] = $result;
	                $repeated_tag_index[$tag . '_' . $level] = 1;
	                if ($priority == 'tag' and $attributes_data)
	                    $current[$tag . '_attr'] = $attributes_data;
	            }
	            else
	            {
	                if (isset ($current[$tag][0]) and is_array($current[$tag]))
	                {
	                    $current[$tag][$repeated_tag_index[$tag . '_' . $level]] = $result;
	                    if ($priority == 'tag' and $get_attributes and $attributes_data)
	                    {
	                        $current[$tag][$repeated_tag_index[$tag . '_' . $level] . '_attr'] = $attributes_data;
	                    }
	                    $repeated_tag_index[$tag . '_' . $level]++;
	                }
	                else
	                {
	                    $current[$tag] = array (
	                        $current[$tag],
	                        $result
	                    );
	                    $repeated_tag_index[$tag . '_' . $level] = 1;
	                    if ($priority == 'tag' and $get_attributes)
	                    {
	                        if (isset ($current[$tag . '_attr']))
	                        {
	                            $current[$tag]['0_attr'] = $current[$tag . '_attr'];
	                            unset ($current[$tag . '_attr']);
	                        }
	                        if ($attributes_data)
	                        {
	                            $current[$tag][$repeated_tag_index[$tag . '_' . $level] . '_attr'] = $attributes_data;
	                        }
	                    }
	                    $repeated_tag_index[$tag . '_' . $level]++; //0 and 1 index is already taken
	                }
	            }
	        }
	        elseif ($type == 'close')
	        {
	            $current = & $parent[$level -1];
	        }
	    }
	    return ($xml_array);
	}
}
?>
