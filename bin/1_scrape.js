'use strict'

const fs = require('fs');
const config = require('../config.js')
const { fetchCached, wait } = require('./helper.js');

start()

async function start() {
	let todos = config.todos.filter(todo => {
		if (!fs.existsSync(todo.cacheFilenameHtml)) return true;
		if (!fs.existsSync(todo.cacheFilenameApi)) {
			//if (7/todo.age > Math.random()) return true;
		};
		return false;
	});

	for (let i = 0; i < todos.length; i++) {
		const { age, medium, date, cacheFilenameApi, cacheFilenameHtml } = todos[i];
		process.stderr.write(`\n${i}/${todos.length} - ${medium.slug} - ${date}`);

		const datestamp = date.replaceAll('-', '');
		const apiUrl = `https://web.archive.org/__wb/calendarcaptures/2?url=${encodeURIComponent(medium.url)}&date=${datestamp}`;

		let apiResponse;
		try {
			apiResponse = await fetchCached(apiUrl, cacheFilenameApi);
		} catch (e) {
			process.stderr.write(' - error:' + e);
			continue;
		}

		apiResponse = JSON.parse(apiResponse);
		if (!apiResponse.items) continue;

		let items = apiResponse.items.filter(i => i[1] === 200);

		if (items.length === 0) {
			process.stderr.write(' - no results');
			continue;
		}

		items = items.map(i => {
			let string = ("000000" + i[0]).slice(-6);
			let seconds = parseInt(string.slice(-2), 10) + parseInt(string.slice(-4, -2), 10) * 60 + parseInt(string.slice(-6, -4), 10) * 3600;
			return [string, Math.abs(seconds - 43200)]
		})
		items.sort((a, b) => a[1] - b[1]);

		let timestamp = items[0][0];

		let htmlUrl = `https://web.archive.org/web/${datestamp}${timestamp}/${medium.url}`;
		//console.log({ htmlUrl });

		try {
			await fetchCached(htmlUrl, cacheFilenameHtml);
			process.stderr.write(' - OK');
		} catch (e) {
			console.log(e);
		}
	}
}
