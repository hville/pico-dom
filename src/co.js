var factory = require('./util/factory'),
		Component = require('./component'),
		ns = require('./util/namespaces'),
		createElement = require('./element'),
		merge = require('./util/merge-object'),
		Fragment = require('./fragment')

function coCreator(sel, att, cnt) {
	return function constructor(opt) {
		var cfg = merge({}, att, opt),
				elm = createElement(sel, cfg)
		return new Component(elm, cfg, new Fragment(cnt))
	}
}

var co = factory(coCreator)
co.svg = factory(coCreator, {xmlns: ns.svg})

module.exports = co
