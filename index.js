var ns = require('./src/util/namespaces'),
		el = require('./src/el'),
		co = require('./src/co'),
		li = require('./src/li'),
		root = require('./src/util/root')

module.exports = {
	el: el,
	co: co,
	li: li,
	namespaces: ns,
	global: root,
}
