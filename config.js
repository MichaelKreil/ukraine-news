'use strict'

const path = require('path');
const fs = require('fs');

const config = {
	dateMin: '2022-02-01',
	media: [
		{ country:'de', name:'T-Online',     slug:'t-online',     url:'www.t-online.de', $page:'#Tcontboxi' },
		{ country:'de', name:'Spiegel',      slug:'spiegel',      url:'www.spiegel.de', $page:'#Inhalt' },
		{ country:'de', name:'Focus',        slug:'focus',        url:'www.focus.de', $page:'#page-container' },
		{ country:'de', name:'Bild',         slug:'bild',         url:'www.bild.de', $page:'.main-content' },
		{ country:'de', name:'FAZ',          slug:'faz',          url:'www.faz.net/aktuell', $page:'.Home' },
		{ country:'de', name:'Welt',         slug:'welt',         url:'www.welt.de', $page:'.c-page-wrapper' },
		{ country:'de', name:'N-TV',         slug:'n-tv',         url:'www.n-tv.de', $page:'[role="main"]' },
		{ country:'de', name:'RTL',          slug:'rtl',          url:'www.rtl.de/news/', $page:'#main' },
		{ country:'de', name:'Stern',        slug:'stern',        url:'www.stern.de', $page:'.page__inner-content' },
		{ country:'de', name:'Süddeutsche',  slug:'sueddeutsche', url:'www.sueddeutsche.de', $page:'.sz-content' },
		{ country:'de', name:'Zeit',         slug:'zeit',         url:'www.zeit.de/index', $page:'#main' },
		{ country:'de', name:'WAZ',          slug:'waz',          url:'www.waz.de', $page:'[role="main"]' },
		{ country:'de', name:'Tagesspiegel', slug:'tagesspiegel', url:'www.tagesspiegel.de', $page:'.ts-content-wrapper' },
		{ country:'de', name:'RP-Online',    slug:'rp-online',    url:'rp-online.de', $page:'[role="main"]' },
		{ country:'de', name:'Tagesschau',   slug:'tagesschau',   url:'www.tagesschau.de', $page:'#content' },
		{ country:'de', name:'Merkur',       slug:'merkur',       url:'www.merkur.de', $page:'[role="main"]' },
		{ country:'de', name:'taz',          slug:'taz',          url:'taz.de', $page:'#pages' },

		{ country:'us', name:'Wall Street Journal', slug:'wsj',            url:'www.wsj.com', $page:'#main' },
		{ country:'us', name:'The New York Times',  slug:'nytimes',        url:'www.nytimes.com', $page:'#site-content' },
		{ country:'us', name:'New York Post',       slug:'nypost',         url:'nypost.com', $page:'#main' },
		{ country:'us', name:'Los Angeles Times',   slug:'latimes',        url:'www.latimes.com', $page:'.page-main' },
		{ country:'us', name:'The Washington Post', slug:'washingtonpost', url:'www.washingtonpost.com', $page:'#main-content' },
		{ country:'us', name:'Star Tribune',        slug:'startribune',    url:'www.startribune.com', $page:'.l-home-container' },
		{ country:'us', name:'The Boston Globe',    slug:'bostonglobe',    url:'www.bostonglobe.com', $page:'#main' },

		{ country:'uk', name:'BBC',           slug:'bbc',       url:'www.bbc.com', $page:'#page' },
		{ country:'uk', name:'The Guardian',  slug:'guardian',  url:'www.theguardian.com/uk', $page:'[role="main"]' },
		{ country:'uk', name:'Daily Mail',    slug:'dailymail', url:'www.dailymail.co.uk/home/index.html', $page:'[itemprop="mainEntity"]' },
		{ country:'uk', name:'The Sun',       slug:'sun',       url:'www.thesun.co.uk', $page:'#main-content' },
		{ country:'uk', name:'Metro',         slug:'metro',     url:'metro.co.uk', $page:'#pageBody' },
		{ country:'uk', name:'The Times',     slug:'times',     url:'www.thetimes.co.uk', $page:'#main-container' },
		{ country:'uk', name:'Mirror',        slug:'mirror',    url:'www.mirror.co.uk', $page:'main' },
		{ country:'uk', name:'The Telegraph', slug:'telegraph', url:'www.telegraph.co.uk', $page:'#main-content' },

		{ country:'fr', name:'Le Figaro',   slug:'lefigaro',   url:'www.lefigaro.fr', $page:'#fig-page' },
		{ country:'fr', name:'Le Monde',    slug:'lemonde',    url:'www.lemonde.fr', $page:'[role="main"]' },
		{ country:'fr', name:'Libération',  slug:'liberation', url:'www.liberation.fr', $page:'#main' },
		{ country:'fr', name:'L\'Equipe',   slug:'lequipe',    url:'www.lequipe.fr', $page:'#outer-edito-content' },
		{ country:'fr', name:'Le Parisien', slug:'leparisien', url:'www.leparisien.fr', $page:'#homepage_container' },
		{ country:'fr', name:'Les Echos',   slug:'lesechos',   url:'www.lesechos.fr', $page:'main' },
		{ country:'fr', name:'La Croix',    slug:'la-croix',   url:'www.la-croix.com', $page:'main' },
		{ country:'fr', name:'20 Minutes',  slug:'20minutes',  url:'www.20minutes.fr', $page:'#page-content' },
		{ country:'fr', name:'Le Progrès',  slug:'leprogres',  url:'www.leprogres.fr', $page:'#wrapper' },
		{ country:'fr', name:'L\'Express',  slug:'lexpress',   url:'www.lexpress.fr', $page:'#pub-cover' },

		{ country:'pl', name:'Fakt',                         slug:'fakt',         url:'fakt.pl', $page:'.grid-container:first' },
		{ country:'pl', name:'Super Express',                slug:'se',           url:'www.se.pl', $page:'.main-content' },
		{ country:'pl', name:'Rzeczpospolita',               slug:'rp',           url:'www.rp.pl', $page:'body' },
		{ country:'pl', name:'Dziennik Gazeta Prawna',       slug:'dziennik',     url:'www.dziennik.pl', $page:'#doc' },
		{ country:'pl', name:'Polska Metropolia Warszawska', slug:'polskatimes',  url:'polskatimes.pl', $page:'main' },
		{ country:'pl', name:'Gazeta Polska Codziennie',     slug:'gpcodziennie', url:'gpcodziennie.pl', $page:'body' },

		{ country:'ru', name:'Moskowski Komsomolez', slug:'mk',           url:'www.mk.ru', $page:'.wraper__content' },
		{ country:'ru', name:'Komsomolskaja Prawda', slug:'kp',           url:'www.kp.ru', $page:'#app' },
		{ country:'ru', name:'Trud',                 slug:'trud',         url:'www.trud.ru', $page:'[data-off-canvas-content]' },
		{ country:'ru', name:'Rossijskaja gaseta',   slug:'rg',           url:'rg.ru', $page:'.l-page__body' },
		{ country:'ru', name:'Nesawissimaja Gaseta', slug:'ng',           url:'www.ng.ru', $page:'#mainpage' },
		{ country:'ru', name:'Wedomosti',            slug:'vedomosti',    url:'www.vedomosti.ru', $page:'.page' },
		{ country:'ru', name:'Gaseta',               slug:'gzt',          url:'gzt.ru', $page:'.main' },

		{ country:'fi', name:'Helsingin Sanomat',  slug:'hs',                url:'www.hs.fi', $page:'main' },
		{ country:'fi', name:'Aamulehti',          slug:'aamulehti',         url:'www.aamulehti.fi', $page:'main' },
		{ country:'fi', name:'Abo Underrattelser', slug:'abounderrattelser', url:'abounderrattelser.fi', $page:'#main-content' },
		{ country:'fi', name:'HBL',                slug:'hbl',               url:'www.hbl.fi', $page:'#page-wrapper' },
		{ country:'fi', name:'Ilta Sanomat',       slug:'is',                url:'www.is.fi', $page:'main' },
		{ country:'fi', name:'Iltalehti',          slug:'iltalehti',         url:'www.iltalehti.fi', $page:'.front' },
		{ country:'fi', name:'Kansan Uutiset',     slug:'kansanuutiset',     url:'www.kansanuutiset.fi', $page:'#cb-container' },
		{ country:'fi', name:'Kaleva',             slug:'kaleva',            url:'www.kaleva.fi', $page:'#main-content' },

	],
	words: [
		// Begriffe
		{ name:'war', us:/\bwar\b/gi, },
		{ name:'invasion', us:/\binvasion/gi, },
		{ name:'military operation', us:/\bmilitary operation/gi, },
		// Orte
		{ name:'ukrain', us:/\bukrain/gi, },
		{ name:'kyiv', us:/\bkyiv/gi, de:/\bkiew/gi, fr:/\bkiev/gi, pl:/\bkij[oó]w/gi, },
		{ name:'odessa', us:/\bodessa/gi, pl:/\bodess[ay]/gi, },
		{ name:'kharkiv', us:/\bkharkiv/gi, de:/\bcharkiw/gi, pl:/\bchark[oó]w/gi, },
		{ name:'kherson', us:/\bkherson/gi, de:/\bcherson/gi, pl:/\bcherso[nń]/gi, },
		{ name:'mariupol', us:/\bmariupol/gi, fr:/\bmarioupol/gi, },
		{ name:'luhansk', us:/\bluhansk/gi, fr:/\blouhansk/gi, pl:/\b[lł]uga[nń]sk/gi, },
		{ name:'chernihiv', us:/\bchernihiv/gi, de:/\btschernihiw/gi, fr:/\btchernihiv/gi, pl:/\bczernih[oó]w/gi, },
		{ name:'donetsk', us:/\bdonetsk/gi, de:/\bdonezk/gi, pl:/\bdonieck/gi, },
		{ name:'lviv', us:/\blviv/gi, de:/\blwiw/gi, pl:/\blw[oó]w/gi, },
		{ name:'chernobyl', us:/\bch[eo]rnobyl/gi, de:/\btsch[eo]rnobyl/gi, fr:/\btch[eo]rnobyl/gi, pl:/\bczarnobyl/gi, },
		// ukrainische Personen
		{ name:'zelensk', us:/\bzelensk/gi, de:/\bselensk/gi, pl:/\bze[lł]ensk/gi, },
		{ name:'klitschko', us:/\bklitschko/gi, pl:/\bk[lł][iy]czko/gi, },
		// russland
		{ name:'putin', us:/\bputin/gi, fr:/\bpoutine/gi, },
		{ name:'kremlin', us:/\bkremlin/gi, de:/\bkreml/gi, pl:/\bkreml/gi, },
		{ name:'russia', us:/\brussia/gi, de:/\bruss(isch|land)/gi, fr:/\brussi?e/gi, pl:/\bros(ja|sij|yjsk)/gi, ru:false },


	],
}

const dayMin = Math.round(Date.parse(config.dateMin)/86400000);
const dayMax = Math.round(Date.now()/86400000-1.5);
config.todos = [];

for (let [index, medium] of config.media.entries()) {
	medium.index = index;
	medium.slug = medium.country+'_'+medium.slug;

	const cacheFolder = path.resolve(__dirname, 'cache/'+medium.slug);
	if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder, { recursive:true })
	for (let day = dayMin; day <= dayMax; day++) {
		const date = (new Date((day+0.5)*86400000)).toISOString().slice(0,10);
		const cacheFilename = path.resolve(cacheFolder, medium.slug+'-'+date);

		config.todos.push({
			medium,
			date,
			cacheFilenameApi:  cacheFilename+'.json.br',
			cacheFilenameHtml: cacheFilename+'.html.br',
		});
	}
}

module.exports = config;
