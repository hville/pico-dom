var creator = require('./util/creator'),
		Component = require('./co/component'),
		element = require('./el/element'),
		Fragment = require('./co/fragment'),
		ns = require('./util/namespaces')

var preset = creator(function co(sel, cfg, cnt) {
	return new Component(element(sel, cfg), cfg, new Fragment(cnt))
})

var co = preset()
co.svg = preset({xmlns: ns.svg})
co.preset = preset

module.exports = co
