var factory = require('./util/factory'),
		Component = require('./component'),
		ns = require('./util/namespaces'),
		createElement = require('./el/create-element'),
		Config = require('./util/config'),
		createChild = require('./util/create-child')

function coCreator(sel, att, cnt) {
	return function constructor(opt) {
		var cfg = new Config(att, opt),
				elm = createElement(att.xmlns, sel, cfg)
		return new Component(elm, cfg, cnt.map(createChild))
	}
}

var co = factory(coCreator)
co.svg = factory(coCreator, {xmlns: ns.svg})

module.exports = co
