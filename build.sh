#!/bin/sh
if [ -z "$1" ]
then
	echo 'No hostname specified. Using localhost.'
        sed 's/@@@DOMAIN_NAME@@@/localhost/g' conf/nginx.conf > nginx.conf
else
	sed "s/@@@DOMAIN_NAME@@@/$1/g" conf/nginx.conf > nginx.conf
fi

BRANCH=`git branch | grep \* | awk '{printf $2}'`
COMMIT=`git log --format="%h" -n 1 | awk '{printf $1}'`
DATE=`git log --format="%ci" -n 1 | awk '{printf $1}'`
echo -n "$BRANCH-$COMMIT-$DATE" > .buildinfo

DATE=`git log --format="%cD" -n 1 | awk '{printf $3 " " $2 ", " $4}'`
echo -n "$DATE" > .builddate

IMAGE_NAME="repograms_`git branch | grep "*" | awk '{ print $2 }'`"

echo 'Building the docker image.'
docker build -t $IMAGE_NAME .

rm nginx.conf .buildinfo .builddate *.log
