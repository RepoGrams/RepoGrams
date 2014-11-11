#!/bin/sh
cat ./conf/nginx_A.conf > nginx.conf

if [ -z "$1" ]
then
	echo 'No hostname specified. Using localhost.'	
	echo 'localhost' >> nginx.conf
else
	echo $1 >> nginx.conf
fi

cat ./conf/nginx_B.conf >> nginx.conf

BRANCH=`git branch | grep \* | awk '{printf $2}'`
COMMIT=`git log --format="%h" -n 1 | awk '{printf $1}'`
DATE=`git log --format="%ci" -n 1 | awk '{printf $1}'`
echo -n "$BRANCH-$COMMIT-$DATE" > .buildinfo

echo 'Building the docker image.'
docker build -t repograms .
