#!/bin/sh
if [ "$(id -u)" != "0" ]; then
	echo "This script must be run as root" 1>&2
	exit 1
fi

if [ -z "$1" ]
then
	echo "No port specified. Using 1234."
	PORT=1234
else
	PORT=$1
fi

echo "Running image at port $PORT."
docker run -p $PORT:80 -p 8090:8090 repograms supervisord &

echo "Running pre-caching of repositories. This may take a minute."
./scripts/prebuild.sh
