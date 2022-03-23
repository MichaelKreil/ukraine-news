'use strict'

const fs = require('fs');
const zlib = require('zlib');
const http = require('http');
const https = require('https');
const config = require('../config.js')

start()

async function start() {
	let todos = config.todos.filter(todo => {
		if (!fs.existsSync(todo.cacheFilenameApi )) return true;
		if (!fs.existsSync(todo.cacheFilenameHtml)) return true;
		return false;
	})

	for (let i = 0; i < todos.length; i++) {
		console.log(i+'/'+todos.length);

		const { medium, date, cacheFilenameApi, cacheFilenameHtml } = todos[i];
		console.log('scrape',medium.slug,date);

		const timestamp = date.replaceAll('-','');
		const apiUrl = `https://archive.org/wayback/available?url=${medium.url}&timestamp=${timestamp}1200`;
		let apiResponse = await fetchCached(apiUrl, cacheFilenameApi);
		apiResponse = JSON.parse(apiResponse);

		let apiResult = apiResponse.archived_snapshots.closest;
		try {
			if (apiResult.status !== '200') throw Error();
			if (!apiResult.available) throw Error();
		} catch (e) {
			console.log(apiUrl);
			console.log(apiResponse);
			console.log('??? rm '+cacheFilenameApi);
			throw e;
		}

		if (!apiResult.timestamp.startsWith(timestamp)) continue;

		let htmlResult = await fetchCached(apiResult.url, cacheFilenameHtml);
	}
}

function fetchCached(url, filename) {
	if (fs.existsSync(filename)) return zlib.brotliDecompressSync(fs.readFileSync(filename));

	return new Promise(resolve => {
		let protocol = url.startsWith('https') ? https : http;

		protocol.get(url, response => {
			if (response.statusCode !== 200) {
				throw Error('status code: '+response.statusCode);
			}
			let buffers = [];
			response.on('data', chunk => buffers.push(chunk));
			response.on('end', () => {
				buffers = Buffer.concat(buffers);
				fs.writeFileSync(filename, zlib.brotliCompressSync(buffers, {params:{[zlib.constants.BROTLI_PARAM_QUALITY]:zlib.constants.BROTLI_MAX_QUALITY}}));

				// be very nice to the archive api
				setTimeout(() => resolve(buffers), 5000);
			})
		})
	})
}
