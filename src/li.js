var creator = require('./util/creator'),
		co = require('./co'),
		ns = require('./util/namespaces'),
		list = require('./co/list')

var preset = creator(function li(sel, cfg, cnt) {
	return list(co(sel, cfg, cnt))
})

var li = preset()
li.svg = preset({xmlns: ns.svg})
li.preset = preset

module.exports = li
