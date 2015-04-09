#!/bin/sh
mkdir -p build

BRANCH=`git branch | grep \* | awk '{printf $2}'`
COMMIT=`git log --format="%h" -n 1 | awk '{printf $1}'`
DATE=`git log --format="%ci" -n 1 | awk '{printf $1}'`
echo -n "$BRANCH-$COMMIT-$DATE" > build/buildinfo.autobuild

DATE=`git log --format="%cD" -n 1 | awk '{printf $3 " " $2 ", " $4}'`
echo -n "$DATE" > build/builddate.autobuild

IMAGE_NAME="repograms_`git branch | grep "*" | awk '{ print $2 }'`"

echo 'Building the docker image.'
docker build -f conf/Dockerfile -t $IMAGE_NAME .

rm build/*.autobuild
