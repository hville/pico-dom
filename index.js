var ns = require('./src/util/namespaces'),
		el = require('./src/el'),
		co = require('./src/co'),
		li = require('./src/li'),
		root = require('./src/util/root'),
		text = require('./src/text'),
		store = require('./src/extra/store')

module.exports = {
	el: el,
	co: co,
	li: li,
	text: text,
	ns: ns,
	store: store,
	global: root,
}

/*
factory = co(el(li...))

moveto(itm, parent, before)
update(itm, ...)

util(tgt, )


*/
