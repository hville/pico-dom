var creator = require('./util/creator'),
		element = require('./element'),
		NS = require('./util/namespaces')

var El = creator(element)
var el = El()
el.svg = El({xmlns: NS.svg})

module.exports = el
