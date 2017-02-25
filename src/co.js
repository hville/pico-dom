var creator = require('./util/creator'),
		element = require('./el/element'),
		ns = require('./util/namespaces'),
		Component = require('./extra/component')

var preset = creator(function(sel, cfg, cnt) {
	return new Component(element(sel, cfg, cnt), cfg)
})

var co = preset()
co.svg = preset({xmlns: ns.svg})
co.preset = preset

module.exports = co
