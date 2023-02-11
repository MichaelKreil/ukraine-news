'use strict'

const fs = require('fs');
const config = require('../config.js')
const { fetchCached, wait } = require('./helper.js');

start()

async function start() {
	let todos = config.todos.filter(todo => {
		if (!fs.existsSync(todo.cacheFilenameApi )) return true;
		if (!fs.existsSync(todo.cacheFilenameHtml)) return true;
		return false;
	})

	for (let i = 0; i < todos.length; i++) {
		const { age, medium, date, cacheFilenameApi, cacheFilenameHtml } = todos[i];
		process.stderr.write(`\n${i}/${todos.length} - ${medium.slug} - ${date}`);

		const timestamp = date.replaceAll('-', '');
		const apiUrl = `https://web.archive.org/wayback/available?url=${medium.url}&timestamp=${timestamp}1200`;

		let apiResponse, apiResult, skip = false;
		for (let j = 1; j <= 5; j++) {
			try {
				apiResponse = await fetchCached(apiUrl, cacheFilenameApi);
			} catch (e) {
				console.log(e);
				continue;
			}
			apiResponse = JSON.parse(apiResponse);
			apiResult = apiResponse.archived_snapshots.closest;
			if (apiResult && apiResult.status.startsWith('20') && apiResult.available) break;
			fs.unlinkSync(cacheFilenameApi)

			if (j >= 3) {
				skip = true;
				break;
			}

			process.stderr.write(`\n   …retry ${j}`);
			await wait(3 * 60 * 1000); // 3 minutes
		}
		if (skip) continue;

		if (!apiResult.timestamp.startsWith(timestamp)) {
			if (age > 60) continue;
			process.stderr.write(` - wrong timestamp`)
			if (Math.random() < 0.03) {
				fs.unlinkSync(cacheFilenameApi)
				process.stderr.write(`, random retry`)
				i--;
			}
			continue;
		}

		try {
			await fetchCached(apiResult.url, cacheFilenameHtml);
			process.stderr.write(' - OK');
		} catch (e) {
			console.log(e);
		}
	}
}
