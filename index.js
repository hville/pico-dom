var ns = require('./src/util/namespaces'),
		el = require('./src/el'),
		co = require('./src/co'),
		li = require('./src/li'),
		ENV = require('./src/env')

module.exports = {
	el: el,
	co: co,
	li: li,
	ns: ns,
	get window() { return ENV.window },
	set window(win) { ENV.window = win }
}
