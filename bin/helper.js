'use strict'


const fs = require('fs');
const zlib = require('zlib');
const http = require('http');
const https = require('https');

module.exports = {
	fetch,
	fetchCached,
	wait,
}

function fetch(url, slowdown) {
	return new Promise(async (resolve, reject) => {
		let protocol = url.startsWith('https') ? https : http;

		if (slowdown) await wait(5000);

		let request = protocol.get(url, async response => {
			if (response.statusCode === 302) {
				resolve(await fetch(response.headers.location, slowdown));
				return;
			}
			if (response.statusCode !== 200) {
				console.log('url', url);
				console.log('headers', response.headers);
				request.destroy();
				return reject(response.statusCode);
			}
			let buffers = [];
			response.on('data', chunk => buffers.push(chunk));
			response.on('end', () => resolve(Buffer.concat(buffers)))
		}).on('error', e => reject(e))
	})
}

async function fetchCached(url, filename, slowdown) {
	if (fs.existsSync(filename)) return zlib.brotliDecompressSync(fs.readFileSync(filename));
	let buffer = await fetch(url, slowdown);
	fs.writeFileSync(filename, zlib.brotliCompressSync(buffer, {params:{[zlib.constants.BROTLI_PARAM_QUALITY]:zlib.constants.BROTLI_MAX_QUALITY}}));
	return buffer;
}

function wait(time) {
	return new Promise(res => setTimeout(res, time));
}
