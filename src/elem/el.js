var factory = require('../util/factory'),
		createElement = require('./create-element'),
		setContent = require('./set-content'),
		ns = require('../util/namespaces')

function htmCreator(sel, att, cnt) {
	return setContent(createElement(null, sel, att), cnt)
}
function svgCreator(sel, att, cnt) {
	return setContent(createElement(ns.svg, sel, att), cnt)
}

var el = factory(htmCreator)
el.svg = factory(svgCreator)

module.exports = el
