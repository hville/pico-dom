var creator = require('./util/creator'),
		element = require('./element'),
		ns = require('./namespaces'),
		Component = require('./component')

var preset = creator(function(sel, cfg, cnt) {
	return new Component(element(sel, cfg, cnt), cfg)
})

var co = preset()
co.svg = preset({xmlns: ns.svg})
co.preset = preset

module.exports = co
