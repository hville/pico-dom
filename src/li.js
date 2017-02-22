var creator = require('./util/creator'),
		co = require('./co'),
		ns = require('./util/namespaces'),
		List = require('./co/list')

var preset = creator(function li(sel, cfg, cnt) {
	return new List(co(sel, cfg, cnt), cfg.dataKey)
})

var li = preset()
li.svg = preset({xmlns: ns.svg})
li.preset = preset

module.exports = li
