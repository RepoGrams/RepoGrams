#!/bin/sh
CONTAINER_ID=`docker ps | grep repograms:latest | grep supervisord | head -n 1 | sed "s/\s.*//"`

if [ ! -z "$CONTAINER_ID" ]; then
	echo "Stopping container $CONTAINER_ID."
	docker stop $CONTAINER_ID
else
	echo "No container found to stop."
fi
