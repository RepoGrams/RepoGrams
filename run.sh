#!/bin/sh
if [ -z "$1" ]
then
	echo "No port specified. Using 1234."
	PORT=1234
else
	PORT=$1
fi

echo "Running image at port $PORT."
docker run -p $PORT:80 repograms supervisord &
