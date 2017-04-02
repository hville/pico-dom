var creator = require('./util/creator'),
		element = require('./element'),
		ns = require('./namespaces')

var preset = creator(element)

var el = preset()
el.svg = preset({xmlns: ns.svg})
el.preset = preset

module.exports = el
