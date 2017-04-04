var creator = require('./util/creator'),
		decorate = require('./decorate'),
		ns = require('./env').namespaces

var preset = creator(decorate)

var el = preset()
el.svg = preset({xmlns: ns.svg})
el.preset = preset

module.exports = el
