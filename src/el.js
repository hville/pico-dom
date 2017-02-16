var factory = require('./util/factory'),
		createElement = require('./el/create-element'),
		setChildren = require('./set-children'),
		NS = require('./util/namespaces'),
		createChild = require('./util/create-child')

function nsCreator(ns) {
	return function creator(sel, att, cnt) {
		return setChildren(createElement(ns, sel, att), cnt.reduce(setChild, []))
	}
}

var el = factory(nsCreator(null))
el.svg = factory(nsCreator(NS.svg))

module.exports = el

function setChild(array, item) {
	var child = createChild(item)
	if (child) array.push(child)
	return array
}
