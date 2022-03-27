'use strict'

const fs = require('fs');
const zlib = require('zlib');
const util = require('util');
const path = require('path');
const cheerio = require('cheerio');
const config = require('../config.js')
const { fetch } = require('./helper.js');

start()

async function start() {
	console.log('check media')
	for (let [i, todo] of config.todos.entries()) {
		if (todo.medium.$page) continue;

		if (!fs.existsSync(todo.cacheFilenameHtml)) continue;
		let html = zlib.brotliDecompressSync(fs.readFileSync(todo.cacheFilenameHtml));
		html = html.toString();

		console.log('analyse https://'+todo.medium.url)

		console.log('  $page is missing. Maybe you find help in this output:')
		let $ = cheerio.load(html);
		scanForContent($, $('body'));

		console.log($);
		process.exit();
	}

	console.log('check words')
	for (let word of config.words) {
		let html = await fetch('https://en.wikipedia.org/wiki/'+word.name.replace(/\s/g, '_'));
		let $ = cheerio.load(html.toString());

		let titles = new Map();
		titles.set('en', $('title').text().replace(/\s+–.*/, ''))
		$('.interlanguage-link a').each((i,a) => {
			a = $(a);
			let title = a.attr('title').replace(/\s+–.*/, '');
			let code = a.attr('lang');
			titles.set(code, title);
		})

		for (let country of config.countries) {
			let regex = word[country.code];
			if (regex === false) continue;
			let title = titles.get(country.lang);
			if (!title) {
				if ((country.lang === 'fi') && (word.name === 'Invasion')) continue; // no wiki article
				console.log(titles);
				console.log(country);
				throw Error('title not found');
			}
			if (!title.match(regex)) {
				console.log('country', country);
				console.log('title', title);
				console.log('regex', regex);
				console.log('match', title.match(regex));
				throw Error('regex does not match');
			}
		}
	}

	console.log('everything is fine')
}

function scanForContent($, root) {
	let fullLength = calcTextLength(root);

	scanRec(root, 1);

	process.exit();

	function scanRec(node, depth) {
		let textLength = calcTextLength(node);

		// ignore everything that has less than 25% of the text content
		if (textLength < 0.25*fullLength) return;

		let result = [
			Math.round(10000*textLength/fullLength)/100,
			`$page:'${node.prop('tagName').toLowerCase()}'`,
			node.attr('class') && `$page:'.${node.attr('class').trim()}'`,
			node.attr('id') && `$page:'#${node.attr('id').trim()}'`,
			node.attr('role') && `$page:'[role="${node.attr('role').trim()}"]'`,
			node.attr('itemprop') && `$page:'[itemprop="${node.attr('itemprop').trim()}"]'`,
		].filter(e => e);
		result = util.inspect(result, {colors:true});
		result = result.replace(/\n/g, '\n'+'  '.repeat(depth))
		result = '  '.repeat(depth)+result;

		console.log(result);
		//console.log(textLength, fullLength);
		node.children().each((i,element) => {
			scanRec($(element), depth+1);
		})
	}

	function calcTextLength(node) {
		let text = node.text();
		text = text.replace(/\s+/gms,' ');
		//console.log(text);
		return text.length
	}
}
