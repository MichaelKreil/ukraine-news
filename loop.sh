#!/bin/sh

cd ${0%/*};

while true; do
	git pull

	node ./bin/1_scrape.js
	node ./bin/2_check.js
	node ./bin/3_analyze.js

	git add .
	git commit -m "automatic update"
	git push

	sleep 12h
done
