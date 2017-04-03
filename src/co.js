var creator = require('./util/creator'),
		element = require('./element'),
		ns = require('./namespaces'),
		Component = require('./component')

var preset = creator(function(sel, cfgs, cnts) {
	return new Component(element(sel, cfgs, cnts), cfgs)
})

var co = preset()
co.svg = preset({xmlns: ns.svg})
co.preset = preset

module.exports = co
