var ns = require('./src/util/namespaces'),
		el = require('./src/el'),
		co = require('./src/co'),
		li = require('./src/li'),
		ENV = require('./src/env'),
		text = require('./src/text')

module.exports = {
	el: el,
	co: co,
	li: li,
	text: text,
	ns: ns,
	setWindow: function setWindow(win) { ENV.window = win },
}
