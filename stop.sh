#!/bin/sh
if [ "$(id -u)" != "0" ]; then
	echo "This script must be run as root" 1>&2
	exit 1
fi

CONTAINER_ID=`docker ps | grep repograms:latest | grep supervisord | head -n 1 | sed "s/\s.*//"`

echo "Stopping container $CONTAINER_ID."
docker stop $CONTAINER_ID
