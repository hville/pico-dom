var ns = require('./src/util/namespaces'),
		el = require('./src/el'),
		co = require('./src/co'),
		li = require('./src/li'),
		root = require('./src/util/root'),
		text = require('./src/text')

module.exports = {
	el: el,
	co: co,
	li: li,
	text: text,
	ns: ns,
	setWindow: function setWindow(win) { root.window = win },
}
