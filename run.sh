#!/bin/sh
if [ -z "$1" ]
then
	echo "No port specified. Using 1234."
	PORT=1234
else
	PORT=$1
fi

echo "Running image at port $PORT."

CONTAINER_NAME="repograms_`git branch | grep "*" | awk '{ print $2 }'`"

docker run -p $PORT:80 --name="$CONTAINER_NAME" repograms supervisord &
