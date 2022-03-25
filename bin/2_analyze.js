'use strict'

const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const config = require('../config.js')

start()

async function start() {
	let timelinesByMedia = new Database();
	let wordCountryMatrix = new Database();

	for (let [i, todo] of config.todos.entries()) {
		process.stdout.write('\r'+(100*i/config.todos.length).toFixed(1)+'%');

		if (!fs.existsSync(todo.cacheFilenameHtml)) continue;
		let html = zlib.brotliDecompressSync(fs.readFileSync(todo.cacheFilenameHtml));
		html = html.toString();

		let cc = todo.medium.country;
		for (let word of config.words) {
			let regex = word[cc] ?? word.us;
			let count = countResults(html.matchAll(regex));

			wordCountryMatrix.set([word.name, todo.medium.country], count);
		}
		//console.log(todo);
		//process.exit();
	}

	console.log(wordCountryMatrix.getMatrix());
}

function countResults(iterator) {
	let count = 0;
	for (let item of iterator) count++;
	return count;
}

function Database() {
	let columnValues = [];
	let data = [];
	return { set, getMatrix }

	function getMatrix() {
		if (columnValues.length !== 2) throw Error();
		let matrix = [['']].concat(data);
		matrix = matrix.map(row => [''].concat(row));

		for (let [t,i] of columnValues[0].entries()) matrix[i+1][0] = t;
		for (let [t,i] of columnValues[1].entries()) matrix[0][i+1] = t;

		return matrix.map(r => r.join('\t')).join('\n');
	}

	function set(keys, count) {
		let list = data;
		keys.forEach((key,col) => {
			let cv = (columnValues[col] ??= new Map());
			if (!cv.has(key)) cv.set(key, cv.size);
			let i = cv.get(key);
			if (col < keys.length-1) {
				list = (list[i] ??= []);
			} else {
				// last column
				list[i] = (list[i] ?? 0) + count;
			}
		})

	}
}
