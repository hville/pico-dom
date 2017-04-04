var creator = require('./util/creator'),
		decorate = require('./decorate'),
		ns = require('./env').namespaces,
		Component = require('./component')

var preset = creator(function(elm, cfg, cnt) {
	return new Component(decorate(elm, cfg, cnt), cfg.extra, cfg.input)
})

var co = preset()
co.svg = preset({xmlns: ns.svg})
co.preset = preset

module.exports = co
