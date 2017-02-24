var creator = require('./util/creator'),
		element = require('./el/element'),
		ns = require('./util/namespaces')

var preset = creator(element)

var el = preset()
el.svg = preset({xmlns: ns.svg})
el.preset = preset

module.exports = el
