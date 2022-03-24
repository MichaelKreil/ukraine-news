'use strict'

const path = require('path');
const fs = require('fs');

const config = {
	dateMin: '2022-02-01',
	media: [
		{ country:'de', name:'T-Online',     slug:'t-online',     url:'www.t-online.de' },
		{ country:'de', name:'Spiegel',      slug:'spiegel',      url:'www.spiegel.de' },
		{ country:'de', name:'Focus',        slug:'focus',        url:'www.focus.de' },
		{ country:'de', name:'Bild',         slug:'bild',         url:'www.bild.de' },
		{ country:'de', name:'FAZ',          slug:'faz',          url:'www.faz.net/aktuell' },
		{ country:'de', name:'Welt',         slug:'welt',         url:'www.welt.de' },
		{ country:'de', name:'N-TV',         slug:'n-tv',         url:'www.n-tv.de' },
		{ country:'de', name:'RTL',          slug:'rtl',          url:'www.rtl.de/news/' },
		{ country:'de', name:'Stern',        slug:'stern',        url:'www.stern.de' },
		{ country:'de', name:'Süddeutsche',  slug:'sueddeutsche', url:'www.sueddeutsche.de' },
		{ country:'de', name:'Zeit',         slug:'zeit',         url:'www.zeit.de/index' },
		{ country:'de', name:'WAZ',          slug:'waz',          url:'www.waz.de' },
		{ country:'de', name:'Tagesspiegel', slug:'tagesspiegel', url:'www.tagesspiegel.de' },
		{ country:'de', name:'RP-Online',    slug:'rp-online',    url:'rp-online.de' },
		{ country:'de', name:'Tagesschau',   slug:'tagesschau',   url:'www.tagesschau.de' },
		{ country:'de', name:'Merkur',       slug:'merkur',       url:'www.merkur.de' },
		{ country:'de', name:'taz',          slug:'taz',          url:'taz.de' },

		{ country:'us', name:'Wall Street Journal', slug:'wsj',            url:'www.wsj.com' },
		{ country:'us', name:'The New York Times',  slug:'nytimes',        url:'www.nytimes.com' },
		{ country:'us', name:'New York Post',       slug:'nypost',         url:'nypost.com' },
		{ country:'us', name:'Los Angeles Times',   slug:'latimes',        url:'www.latimes.com' },
		{ country:'us', name:'The Washington Post', slug:'washingtonpost', url:'www.washingtonpost.com' },
		{ country:'us', name:'Star Tribune',        slug:'startribune',    url:'www.startribune.com' },
		{ country:'us', name:'The Boston Globe',    slug:'bostonglobe',    url:'www.bostonglobe.com' },

		{ country:'uk', name:'BBC',           slug:'bbc',       url:'www.bbc.com' },
		{ country:'uk', name:'The Guardian',  slug:'guardian',  url:'www.theguardian.com/uk' },
		{ country:'uk', name:'Daily Mail',    slug:'dailymail', url:'www.dailymail.co.uk/home/index.html' },
		{ country:'uk', name:'The Sun',       slug:'sun',       url:'www.thesun.co.uk' },
		{ country:'uk', name:'Metro',         slug:'metro',     url:'metro.co.uk' },
		{ country:'uk', name:'The Times',     slug:'times',     url:'www.thetimes.co.uk' },
		{ country:'uk', name:'Mirror',        slug:'mirror',    url:'www.mirror.co.uk' },
		{ country:'uk', name:'The Telegraph', slug:'telegraph', url:'www.telegraph.co.uk' },

		{ country:'fr', name:'Le Figaro',   slug:'lefigaro',   url:'www.lefigaro.fr' },
		{ country:'fr', name:'Le Monde',    slug:'lemonde',    url:'www.lemonde.fr' },
		{ country:'fr', name:'Libération',  slug:'liberation', url:'www.liberation.fr' },
		{ country:'fr', name:'L\'Equipe',   slug:'lequipe',    url:'www.lequipe.fr' },
		{ country:'fr', name:'Le Parisien', slug:'leparisien', url:'www.leparisien.fr' },
		{ country:'fr', name:'Les Echos',   slug:'lesechos',   url:'www.lesechos.fr' },
		{ country:'fr', name:'La Croix',    slug:'la-croix',   url:'www.la-croix.com' },
		{ country:'fr', name:'20 Minutes',  slug:'20minutes',  url:'www.20minutes.fr' },
		{ country:'fr', name:'Le Progrès',  slug:'leprogres',  url:'www.leprogres.fr' },
		{ country:'fr', name:'L\'Express',  slug:'lexpress',   url:'www.lexpress.fr' },

		{ country:'pl', name:'Fakt',                         slug:'fakt',         url:'fakt.pl' },
		{ country:'pl', name:'Gazeta Wyborcza',              slug:'wyborcza',     url:'wyborcza.pl/0,0.html' },
		{ country:'pl', name:'Super Express',                slug:'se',           url:'www.se.pl' },
		{ country:'pl', name:'Rzeczpospolita',               slug:'rp',           url:'www.rp.pl' },
		{ country:'pl', name:'Dziennik Gazeta Prawna',       slug:'dziennik',     url:'www.dziennik.pl' },
		{ country:'pl', name:'Polska Metropolia Warszawska', slug:'polskatimes',  url:'polskatimes.pl' },
		{ country:'pl', name:'Gazeta Polska Codziennie',     slug:'gpcodziennie', url:'gpcodziennie.pl' },
	],
	words: [
		// Orte
		{ us:/\bukrain/gi, },
		{ us:/\bkyiv/gi, de:/\bkiew/gi, fr:/\bkiev/gi, pl:/\bkijów/gi, },
		{ us:/\bodessa/gi, },
		{ us:/\bkharkiv/gi, de:/\bcharkiw/gi, pl:/\bcharków/gi, },
		{ us:/\bkherson/gi, de:/\bcherson/gi, pl:/\bchersoń/gi, },
		{ us:/\bmariupol/gi, fr:/\bmarioupol/gi, },
		{ us:/\bluhansk/gi, fr:/\blouhansk/gi, pl:/\bługańsk/gi, },
		{ us:/\bchernihiv/gi, de:/\btschernihiw/gi, fr:/\btchernihiv/gi, pl:/\bczernihów/gi, },
		{ us:/\bdonetsk/gi, de:/\bdonezk/gi, pl:/\bdonieck/gi, },
		{ us:/\bch[eo]rnobyl/gi, de:/\btsch[eo]rnobyl/gi, fr:/\btch[eo]rnobyl/gi, pl:/\bczarnobyl/gi, },
		// ukrainische Personen
		{ us:/\bzelensk/gi, de:/\bselensk/gi, fr:/\bselensk/gi, pl:/\bZełensk/gi, },
		{ us:/\bklitschko/gi, pl:/\bk(ły|li)czko/gi, },
		// russland
		{ us:/\bputin/gi, fr:/\bpoutine/gi, },
		{ us:/\bkremlin/gi, de:/\bkreml/gi, pl:/\bkreml/gi, },
		{ us:/\brussia/gi, de:/\bruss(isch|land)/gi, fr:/\brussi?e/gi, pl:/\bros(ja|sij|yjsk)/gi, },
	],
}

const dayMin = Math.round(Date.parse(config.dateMin)/86400000);
const dayMax = Math.round(Date.now()/86400000-2);
config.todos = [];

for (let medium of config.media) {
	let slug = medium.country+'_'+medium.slug;
	const cacheFolder = path.resolve(__dirname, 'cache/'+slug);
	if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder, { recursive:true })
	for (let day = dayMin; day <= dayMax; day++) {
		const date = (new Date((day+0.5)*86400000)).toISOString().slice(0,10);
		const cacheFilename = path.resolve(cacheFolder, slug+'-'+date);

		config.todos.push({
			medium,
			date,
			cacheFilenameApi:  cacheFilename+'-api.br',
			cacheFilenameHtml: cacheFilename+'-html.br',
		});
	}
}

module.exports = config;
