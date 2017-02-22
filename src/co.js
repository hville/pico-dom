var creator = require('./util/creator'),
		Component = require('./co/component'),
		element = require('./el/element'),
		ns = require('./util/namespaces')

var preset = creator(function(sel, cfg, cnt) {
	return new Component(element(sel, cfg), cfg, cnt)
})

var co = preset()
co.svg = preset({xmlns: ns.svg})
co.preset = preset

module.exports = co
