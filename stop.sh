#!/bin/sh
CONTAINER_NAME="repograms_`git branch | grep "*" | awk '{ print $2 }'`"
CONTAINER_IS_RUNNING=$(docker ps | grep $CONTAINER_NAME)
if [ $? -eq 0 ]; then
	echo "Stopping container $CONTAINER_NAME."
	docker stop $CONTAINER_NAME
	docker rm $CONTAINER_NAME
else
	echo "No container found to stop."
fi
