'use strict'

const fs = require('fs');
const zlib = require('zlib');
const util = require('util');
const path = require('path');
const cheerio = require('cheerio');
const config = require('../config.js')

start()

async function start() {
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
