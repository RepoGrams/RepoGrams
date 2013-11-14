<?php 
Header("Content-Type: image/png"); 
# Hier wird der Header gesendet, der später die Bilder "rendert" ausser png kann auch jpeg dastehen 

################################################## 
$width = 300; # Später die Breite des Rechtecks 
$height = 300; # Später die Höhe des Rechtecks 
$img = ImageCreate($width, $height); # Hier wird das Bild einer Variable zu gewiesen 
################################################## 

################################################## 
$black = ImageColorAllocate($img, 0, 0, 0); # Hier wird die Farbe schwarz einer Variable zugewiesen 
$red = ImageColorAllocate($img, 255, 0, 0); # Hier wird die Farbe rot einer Variable zugewiesen 
$yellow = ImageColorAllocate($img, 255, 255, 0); # Hier wird die Farbe gelb einer Variable zugewiesen 
$grun = ImageColorAllocate($img, 155, 255, 30);
$weis = ImageColorAllocate($img, 255, 255, 255);
################################################## 


################################################## 
ImageFill($img, 0, 0, $weis);
ImageFilledRectangle($img, 100, 100, 100, 100, $yellow); # Erst wird das Bild mit gelb gefüllt. 
ImageFilledRectangle($img, 301, 100, 100, 100, $black); # Mit ImageFillRectangle wird ein weiter Bereich des Bildes mit schwarz gefüllt 
# Die 1. 0 ist die Entfernung in px von Links. 
# Die 2. 0 ist die Entfernung in px von Oben. 
# Die 300 ist die Breite der Farbe. 
# Die 100 ist die Höhe der Farbe. 
ImageFilledRectangle($img, 201, 100, 100, 100, $red); 
# Hier die gleichen Sachen wie bei der Schwarzfüllung, nur mit anderen Koordinaten und anderer Farbe. 
ImageFilledRectangle($img, 0, 200, 100, 100, $grun); 
################################################## 
ImagePNG($img); 
ImageDestroy($img) # Hier wird der Speicherplatz für andere Sachen geereinigt 
?>