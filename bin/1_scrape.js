'use strict'

const fs = require('fs');
const path = require('path');
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
		const { medium, date, cacheFilenameApi, cacheFilenameHtml } = todos[i];
		console.log(i+'/'+todos.length,'scrape',medium.slug,date);

		const timestamp = date.replaceAll('-','');
		const apiUrl = `https://web.archive.org/wayback/available?url=${medium.url}&timestamp=${timestamp}1200`;

		let apiResponse, apiResult;
		for (let j = 1; j <= 5; j++) {
			apiResponse = await fetchCached(apiUrl, cacheFilenameApi);
			apiResponse = JSON.parse(apiResponse);
			apiResult = apiResponse.archived_snapshots.closest;
			if (apiResult && apiResult.status.startsWith('20') && apiResult.available) break;
			fs.unlinkSync(cacheFilenameApi)
			console.log('apiUrl', apiUrl);
			console.log('apiResult', apiResult);
			console.log('   …retry '+j)
			await wait(5000);
		}

		await wait(5000);

		if (!apiResult.timestamp.startsWith(timestamp)) {
			console.log('   skipping, cause wrong timestamp - '+path.relative(__dirname, cacheFilenameApi))
			continue;
		}

		await fetchCached(apiResult.url, cacheFilenameHtml);
		await wait(5000);
	}
}
