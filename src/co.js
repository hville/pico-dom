var ns = require('./util/namespaces'),
		cofab = require('./co-fab')

var co = cofab()
co.svg = cofab({xmlns: ns.svg})

module.exports = co
