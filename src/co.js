var factory = require('./util/factory'),
		Component = require('./component'),
		ns = require('./util/namespaces'),
		createElement = require('./element'),
		merge = require('./util/merge-object'),
		Fragment = require('./fragment'),
		cofab = require('./co-fab')

function coCreator(sel, att, cnt) {
	return function constructor(opt) {
		var cfg = merge({}, att, opt),
				elm = createElement(sel, cfg)
		return new Component(elm, cfg, new Fragment(cnt))
	}
}

var co = cofab()
co.svg = cofab({xmlns: ns.svg})

module.exports = co
