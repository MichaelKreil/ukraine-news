'use strict'

const fs = require('fs');
const zlib = require('zlib');
const { resolve } = require('path');
const cheerio = require('cheerio');
const config = require('../config.js')
const { Level } = require('level');

start()

async function start() {
	let folder = resolve(__dirname, '../tmp/cached_results');
	fs.mkdirSync(folder, {recursive:true});
	let db = new Level(folder, {keyEncoding:'json', valueEncoding:'json'})

	let timelinesByMedia = [];
	let wordCountryMatrix = new Database();

	for (let [i, todo] of config.todos.entries()) {
		process.stdout.write('\r'+(100*i/config.todos.length).toFixed(1)+'%');

		if (!fs.existsSync(todo.cacheFilenameHtml)) continue;

		let lang = todo.medium.lang;
		let text;
		for (let word of config.words) {
			if (word[lang] === false) continue;

			let key = [
				todo.cacheFilenameHtml,
				todo.medium.convert?.name,
				todo.medium.$page,
				word[lang].toString()
			]
			let count;
			try {
				count = await db.get(key)
			} catch (e) {
				text ??= getText();
				count = countResults(text.matchAll(word[lang]));
				await db.put(key, count);
			}

			wordCountryMatrix.set([word.name, todo.medium.country], count);

			let i = todo.medium.index;
			if (!timelinesByMedia[i]) timelinesByMedia[i] = { medium:todo.medium, list:new Map() }
			if (!timelinesByMedia[i].list.has(todo.date)) {
				timelinesByMedia[i].list.set(todo.date, { date:todo.date, value:count  })
			} else {
				timelinesByMedia[i].list.get(todo.date).value += count;
			}

		}

		function getText() {
			let html = zlib.brotliDecompressSync(fs.readFileSync(todo.cacheFilenameHtml));
			if (todo.medium.convert) html = todo.medium.convert(html);
			html = html.toString();
			let text = cheerio.load(html)(todo.medium.$page).text();
			return text.replace(/\s+/gm, ' ');
		}
	}

	timelinesByMedia.forEach(t => t.list = Array.from(t.list.values()).sort((a,b) => (a.date < b.date) ? -1 : 1));
	fs.writeFileSync(resolve(__dirname, '../docs/data.json'), JSON.stringify(timelinesByMedia, null, '\t'));

	console.log();
	//console.dir(timelinesByMedia, {depth:5});
	console.log(wordCountryMatrix.getMatrix());
}

function countResults(iterator) {
	let count = 0;
	for (let item of iterator) count++;
	return count;
}

function Database() {
	let columnValues = [];
	let data = new Map();
	return { set, getArrays, getMatrix }

	function getMatrix() {
		if (columnValues.length !== 2) throw Error();
		let matrix = [[]];
		let rows = Array.from(columnValues[0].values()).sort();
		let cols = Array.from(columnValues[1].values()).sort();

		cols.forEach((tx,x) => matrix[0][x+1] = tx);
		rows.forEach((ty,y) => {
			matrix[y+1] = [ty]
			cols.forEach((tx,x) => matrix[y+1][x+1] = data.get(ty+','+tx))
		})

		return matrix.map(r => r.join('\t')).join('\n');
	}

	function getArrays() {
		if (columnValues.length !== 2) throw Error();
		let rows = Array.from(columnValues[0].values()).sort();
		let cols = Array.from(columnValues[1].values()).sort();

		return rows.map(obj => ({
			obj,
			list:cols.map(x => ({x, v: data.get(obj.toString()+','+x.toString())}))
		}))
	}

	function set(keys, count) {
		keys.forEach((key,col) => {
			let cv = (columnValues[col] ??= new Set());
			if (!cv.has(key)) cv.add(key);
		})
		let key = keys.join(',');
		data.set(key, (data.get(key) ?? 0)+count);
	}
}
