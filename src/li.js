var creator = require('./util/creator'),
		co = require('./co'),
		ns = require('./util/namespaces'),
		list = require('./list')

var Li = creator(function li(sel, cfg, cnt) {
	return list(co(sel, cfg, cnt))
})

var li = Li()
li.svg = Li({xmlns: ns.svg})

module.exports = li
