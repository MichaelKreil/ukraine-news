'use strict'

const path = require('path');
const fs = require('fs');
const Iconv = require('iconv').Iconv;

const config = {
	dateMin: '2022-01-01',
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
		{ country:'fr', name:'Le Parisien', slug:'leparisien', url:'www.leparisien.fr', $page:'#homepage_container' },
		{ country:'fr', name:'Les Echos',   slug:'lesechos',   url:'www.lesechos.fr', $page:'main' },
		{ country:'fr', name:'La Croix',    slug:'la-croix',   url:'www.la-croix.com', $page:'main' },
		{ country:'fr', name:'20 Minutes',  slug:'20minutes',  url:'www.20minutes.fr', $page:'#page-content' },
		{ country:'fr', name:'Le Progrès',  slug:'leprogres',  url:'www.leprogres.fr', $page:'#wrapper' },
		{ country:'fr', name:'L\'Express',  slug:'lexpress',   url:'www.lexpress.fr', $page:'#pub-cover' },

		{ country:'pl', name:'Fakt',                         slug:'fakt',         url:'fakt.pl', $page:'body' },
		{ country:'pl', name:'Super Express',                slug:'se',           url:'www.se.pl', $page:'.main-content' },
		{ country:'pl', name:'Rzeczpospolita',               slug:'rp',           url:'www.rp.pl', $page:'body' },
		{ country:'pl', name:'Dziennik Gazeta Prawna',       slug:'dziennik',     url:'www.dziennik.pl', $page:'#doc' },
		{ country:'pl', name:'Polska Metropolia Warszawska', slug:'polskatimes',  url:'polskatimes.pl', $page:'main' },
		{ country:'pl', name:'Gazeta Polska Codziennie',     slug:'gpcodziennie', url:'gpcodziennie.pl', $page:'body' },

		{ country:'ru', name:'Moskowski Komsomolez', slug:'mk',           url:'www.mk.ru', $page:'.wraper__content' },
		{ country:'ru', name:'Komsomolskaja Prawda', slug:'kp',           url:'www.kp.ru', $page:'#app' },
		{ country:'ru', name:'Trud',                 slug:'trud',         url:'www.trud.ru', $page:'.off-canvas-content', convert:buf => new Iconv('CP1251', 'UTF-8').convert(buf) },
		{ country:'ru', name:'Rossijskaja Gaseta',   slug:'rg',           url:'rg.ru', $page:'.l-page__body' },
		{ country:'ru', name:'Nesawissimaja Gaseta', slug:'ng',           url:'www.ng.ru', $page:'#mainpage' },

		{ country:'fi', name:'Helsingin Sanomat',  slug:'hs',                url:'www.hs.fi', $page:'main' },
		{ country:'fi', name:'Aamulehti',          slug:'aamulehti',         url:'www.aamulehti.fi', $page:'main' },
		{ country:'fi', name:'Abo Underrattelser', slug:'abounderrattelser', url:'abounderrattelser.fi', $page:'#main-content' },
		{ country:'fi', name:'HBL',                slug:'hbl',               url:'www.hbl.fi', $page:'#page-wrapper' },
		{ country:'fi', name:'Ilta Sanomat',       slug:'is',                url:'www.is.fi', $page:'main' },
		{ country:'fi', name:'Iltalehti',          slug:'iltalehti',         url:'www.iltalehti.fi', $page:'.front' },
		{ country:'fi', name:'Kansan Uutiset',     slug:'kansanuutiset',     url:'www.kansanuutiset.fi', $page:'#cb-container' },
		{ country:'fi', name:'Kaleva',             slug:'kaleva',            url:'www.kaleva.fi', $page:'#main-content' },

		{ country:'ua', name:'Holos Ukrajiny',      slug:'holos',         url:'www.golos.com.ua', $page:'body' },
		{ country:'ua', name:'ATR',                 slug:'atr',           url:'atr.ua', $page:'main' },
		{ country:'ua', name:'Ekspres',             slug:'ekspres',       url:'expres.online', $page:'main' },
		{ country:'ua', name:'Fakty i kommentarii', slug:'fakty',         url:'fakty.ua', $page:'.page_cnt' },
		{ country:'ua', name:'ICTV',                slug:'ictv',          url:'ictv.ua/ua', $page:'.container' },
		{ country:'ua', name:'Korrespondent',       slug:'korrespondent', url:'ua.korrespondent.net', $page:'.layout-content' },
		{ country:'ua', name:'Ukrajina moloda',     slug:'umoloda',       url:'www.umoloda.kiev.ua', $page:'#main' },
		{ country:'ua', name:'Wysokyj Zamok',       slug:'wz',            url:'wz.lviv.ua', $page:'#main' },
		{ country:'ua', name:'Zerkalo nedeli',      slug:'zn',            url:'zn.ua', $page:'#holder' },
	],
	countries: [
		{ code:'de', lang:'de' },
		{ code:'us', lang:'en' },
		{ code:'uk', lang:'en' },
		{ code:'ua', lang:'uk' },
		{ code:'fr', lang:'fr' },
		{ code:'pl', lang:'pl' },
		{ code:'ru', lang:'ru' },
		{ code:'fi', lang:'fi' },
	],
	words: [
		// Begriffe
		{ name:'War', en:/\bwar\b/gi, de:/\bkrieg/gi, fr:/\bguerre/gi, pl:/\bwojna/gi, ru:/война/gi, fi:/\bsota/gi, uk:/війна/gi },
		{ name:'Invasion', en:/\binvasion/gi, pl:/\binwazja/gi, ru:/вторжение/gi, fi:/invaasion/gi, uk:/вторгнення/gi },
		{ name:'Tank', en:/\btank/gi, de:/\bpanzer/gi, fr:/\bchar\b/gi, pl:/\bczołg/gi, fi:/panssarivaunu/gi, ru:/танк/gi, uk:/танк/gi },
		// Orte
		{ name:'Ukraine', en:/\bukrain/gi, ru:/украин/gi, uk:false },
		{ name:'Kyiv', en:/\bkyiv/gi, de:/\bkiew/gi, fr:/\bkiev/gi, pl:/\bkij[oó]w/gi, ru:/киев/gi, fi:/\bkiova/gi, uk:false },
		{ name:'Odessa', en:/\bodessa/gi, pl:/\bodess[ay]/gi, ru:/одесса/gi, uk:false },
		{ name:'Kharkiv', en:/\bkharkiv/gi, de:/\bcharkiw/gi, pl:/\bchark[oó]w/gi, ru:/харьков/gi, fi:/\bharkova/gi, uk:false },
		{ name:'Kherson', en:/\bkherson/gi, de:/\bcherson/gi, pl:/\bcherso[nń]/gi, ru:/херсон/gi, fi:/\bh.erson/gi, uk:false },
		{ name:'Mariupol', en:/\bmariupol/gi, fr:/\bmarioupol/gi, ru:/мариуполь/gi, uk:false },
		{ name:'Luhansk', en:/\bluhansk/gi, fr:/\blouhansk/gi, pl:/[lł]uga[nń]sk/gi, ru:/луганск/gi, uk:false },
		{ name:'Chernihiv', en:/\bchernihiv/gi, de:/\btschernihiw/gi, fr:/\btchernihiv/gi, pl:/\bczernih[oó]w/gi, ru:/чернигов/gi, fi:/\btšernihiv/gi, uk:false },
		{ name:'Donetsk', en:/\bdonetsk/gi, de:/\bdonezk/gi, pl:/\bdonieck/gi, ru:/донецк/gi, uk:false },
		{ name:'Lviv', en:/\blviv/gi, de:/\blwiw/gi, pl:/\blw[oó]w/gi, ru:/львов/gi, uk:false },
		{ name:'Chernobyl', en:/\bch[eo]rnobyl/gi, de:/\btsch[eo]rnobyl/gi, fr:/\btch[eo]rnobyl/gi, pl:/\bczarnobyl/gi, ru:/чернобыль/gi, fi:/\btšernobyl/gi, uk:false },
		{ name:'Bucha, Kyiv Oblast', en:/\bbucha/gi, de:/\bbutscha/gi, fr:/\bboutcha/gi, pl:/bucza/gi, ru:/буча/gi, fi:/\bbutša/gi, uk:false },
		{ name:'Irpin', en:/\birpin/gi, pl:/\birpień/gi, ru:/ирпень/gi, uk:false },
		// ukrainische Personen
		{ name:'Volodymyr Zelenskyy', en:/\bzelensk/gi, de:/\bselensk/gi, pl:/\bze[lł]ensk/gi, ru:/зеленский/gi, uk:false },
		{ name:'Vitali Klitschko', en:/\bklitschko/gi, pl:/\bk[lł][iy]czko/gi, ru:/кличко/gi, fi:/\bklytško/gi, uk:false },
		// russland
		{ name:'Vladimir Putin', en:/\bputin/gi, fr:/\bpoutine/gi, ru:false, uk:/путін/gi },
		{ name:'Kremlin', en:/\bkremlin/gi, de:/\bkreml/gi, pl:/\bkreml/gi, ru:false, fi:/\bkreml/gi, uk:/кремль/gi },
		{ name:'Russia', en:/\brussia/gi, de:/\bruss(isch|land)/gi, fr:/\brussi?e/gi, pl:/\bros(ja|sij|yjsk)/gi, ru:false, fi:/\bvenäjä/gi, uk:/росія/gi },
	],
}

const dayMin = Math.round(Date.parse(config.dateMin)/86400000);
const today = Math.floor(Date.now()/86400000-2);
config.todos = [];

for (let [index, medium] of config.media.entries()) {
	medium.index = index;
	medium.slug = medium.country+'_'+medium.slug;
	medium.lang ??= config.countries.find(c => c.code === medium.country).lang;

	const cacheFolder = path.resolve(__dirname, 'data/'+medium.slug);
	if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder, { recursive:true })
	for (let day = dayMin; day <= today; day++) {
		if (day > today-2) continue;
		const dateTime = new Date((day+0.5)*86400000)
		const date = dateTime.toISOString().slice(0,10);
		const cacheFilename = path.resolve(cacheFolder, medium.slug+'-'+date);

		config.todos.push({
			medium,
			date,
			dateTime,
			cacheFilenameApi:  cacheFilename+'.json.br',
			cacheFilenameHtml: cacheFilename+'.html.br',
		});
	}
}

config.todos.sort((a,b) => {
	if (a.date !== b.date) return a.date < b.date ? -1 : 1;
	if (a.medium !== b.medium) return a.medium.index - b.medium.index;
	return 0;
})

for (let word of config.words) {
	for (let country of config.countries) {
		let code = country.code;
		if (word[code]) continue;
		if (word[code] === false) continue;
		word[code] = word.en;
	}
}

module.exports = config;
