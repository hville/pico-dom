var factory = require('./util/factory'),
		Component = require('./component'),
		ns = require('./util/namespaces'),
		createElement = require('./el/create-element'),
		Config = require('./util/config'),
		createChild = require('./util/create-child'),
		List = require('./list')

function liCreator(sel, att, cnt) {
	return function constructor(opt) {
		var cfg = opt ? new Config(att, opt) : att
		function coFab() {
			return new Component(createElement(sel, cfg), cfg, cnt.map(createChild))
		}
		return new List(coFab)
	}
}

var li = factory(liCreator)
li.svg = factory(liCreator, {xmlns: ns.svg})

module.exports = li
