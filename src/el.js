var factory = require('./util/factory'),
		element = require('./element'),
		NS = require('./util/namespaces')

function svg(sel, att, cnt) {
	att.xmlns = NS.svg
	return element(sel, att, cnt)
}

var el = factory(element)
el.svg = factory(svg)

module.exports = el
