var creator = require('./util/creator'),
		element = require('./el/element'),
		ns = require('./util/namespaces'),
		Extra = require('./extra/extra'),
		store = require('./extra/store')

var preset = creator(function(sel, cfg, cnt) {
	var elm = element(sel, cfg, cnt),
			ctx = new Extra(elm, cfg)
	store(elm, ctx)
	return ctx
})

var co = preset()
co.svg = preset({xmlns: ns.svg})
co.preset = preset

module.exports = co
