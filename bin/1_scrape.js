'use strict'

const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const config = require('../config.js')
const { fetch, wait } = require('./helper.js');

start()

async function start() {
	let todos = config.todos.filter(todo => {
		if (!fs.existsSync(todo.cacheFilenameApi )) return true;
		if (!fs.existsSync(todo.cacheFilenameHtml)) return true;
		return false;
	})

	for (let i = 0; i < todos.length; i++) {
		const { medium, date, cacheFilenameApi, cacheFilenameHtml } = todos[i];
		console.log(i+'/'+todos.length,'scrape',medium.slug,date);

		const timestamp = date.replaceAll('-','');
		const apiUrl = `https://archive.org/wayback/available?url=${medium.url}&timestamp=${timestamp}1200`;
		let apiResponse = await fetchCached(apiUrl, cacheFilenameApi);
		apiResponse = JSON.parse(apiResponse);

		let apiResult = apiResponse.archived_snapshots.closest;
		try {
			if (!apiResult.status.startsWith('20')) throw Error();
			if (!apiResult.available) throw Error();
		} catch (e) {
			console.log(apiUrl);
			console.log(apiResponse);
			console.log('??? rm '+cacheFilenameApi);
			continue;
		}

		if (!apiResult.timestamp.startsWith(timestamp)) {
			console.log('   skipping, cause wrong timestamp - '+path.relative(__dirname, cacheFilenameApi))
			continue;
		}

		let htmlResult = await fetchCached(apiResult.url, cacheFilenameHtml);
	}
}

async function fetchCached(url, filename) {
	if (fs.existsSync(filename)) return zlib.brotliDecompressSync(fs.readFileSync(filename));

	let buffer = fetch(url);

	fs.writeFileSync(filename, zlib.brotliCompressSync(buffer, {params:{[zlib.constants.BROTLI_PARAM_QUALITY]:zlib.constants.BROTLI_MAX_QUALITY}}));

	// be very nice to the archive api
	wait(5000);

	return buffer;
}
