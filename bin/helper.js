'use strict'


const http = require('http');
const https = require('https');

module.exports = {
	fetch,
	wait,
}

function fetch(url) {
	return new Promise(resolve => {
		let protocol = url.startsWith('https') ? https : http;

		protocol.get(url, response => {
			if (response.statusCode !== 200) {
				throw Error('status code: '+response.statusCode);
			}
			let buffers = [];
			response.on('data', chunk => buffers.push(chunk));
			response.on('end', () => resolve(Buffer.concat(buffers)))
		})
	})
}

function wait(time) {
	return new Promise(res => setTimeout(res, time));
}
