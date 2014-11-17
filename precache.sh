#!/bin/sh
echo "Running pre-caching of repositories. This may take a minute."

if [ -z "$1" ]
then
	echo "Usage: `basename $0` [list-of-repository-urls-file]"
	exit 1
fi

while read -r LINE
do
	REPO=`echo $LINE | sed '/^#/d' | sed '/^\s*$/d'`
	if [ -n "$REPO" ]
	then
		echo "| Precaching $REPO"
		RESULT=`curl -X POST http://localhost:8090/getGitData -d "{\"repourl\":\"$REPO\"}" -H "Content-Type: application/json" --silent --show-error`
		echo "+-- $RESULT" | head -c 80
		echo " "
	fi
done < $1
echo "Done pre-caching of repositories."
