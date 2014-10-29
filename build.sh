#!/bin/sh
if [ "$(id -u)" != "0" ]; then
	echo "This script must be run as root" 1>&2
	exit 1
fi

cat ./conf/nginx_A.conf > nginx.conf

if [ -z "$1" ]
then
	echo 'No hostname specified. Using localhost.'	
	echo 'localhost' >> nginx.conf
else
	echo $1 >> nginx.conf
fi

cat ./conf/nginx_B.conf >> nginx.conf


echo 'Building the docker image.'
docker build -t repograms .
