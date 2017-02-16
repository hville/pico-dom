var factory = require('./util/factory'),
		createElement = require('./el/create-element'),
		setChildren = require('./set-children'),
		NS = require('./util/namespaces'),
		createChild = require('./util/create-child'),
		Config = require('./util/config')

function nsCreator(def) {
	return function creator(sel, att, cnt) {
		return setChildren(createElement(sel, def ? new Config(def, att) : att), cnt.reduce(setChild, []))
	}
}

var el = factory(nsCreator())
el.svg = factory(nsCreator({xmlns: NS.svg}))

module.exports = el

function setChild(array, item) {
	var child = createChild(item)
	if (child) array.push(child)
	return array
}
