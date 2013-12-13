<?php
require_once __DIR__.'/../lib/vcs/RepoImporter.class.php';
class RepoImporterTest extends RepoImporter
{
  private $escapeChar; 
  public function __construct() {
    $escapeChar = chr(26);
  }

  public function testUnescape() {
    $escaped = "";
    $shouldBe = "";
    self::unescape($escaped, $escapeChar);
  }
  
}

$rpTest = new RepoImporterTest();
$rpTest.testUnescape();

?>
