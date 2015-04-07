#!/bin/sh
if [ -z "$2" ]
then
	echo "Usage: `basename $0` [domain-name] [list-of-repository-urls-file]"
	exit 1
fi

echo "Running pre-caching of repositories. This may take a minute."
while read -r LINE
do
	REPO=`echo $LINE | sed '/^#/d' | sed '/^\s*$/d'`
	if [ -n "$REPO" ]
	then
		echo "| Precaching $REPO"
		RESULT=`curl -X POST http://$1/getGitData -d "{\"repourl\":\"$REPO\"}" -H "Content-Type: application/json" --silent --show-error`
		echo "+-- $RESULT" | head -c 80
		echo " "
	fi
done < $2
echo "Done pre-caching of repositories."
