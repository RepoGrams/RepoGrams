#!/bin/sh

cat ./conf/nginx_A.conf > nginx.conf

if [[ -z "$1" ]]
then
	echo 'No hostname specified. Using localhost.'	
	echo 'localhost' >> nginx.conf
else
	echo $1 >> nginx.conf
fi

cat ./conf/nginx_B.conf >> nginx.conf


echo 'Building the docker image.'
docker build -t repograms .

echo 'Running image at port 1234.'
docker run -p 1234:80 -p 8090:8090 repograms supervisord
