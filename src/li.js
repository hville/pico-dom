var factory = require('./util/factory'),
		Component = require('./component'),
		ns = require('./util/namespaces'),
		createElement = require('./element'),
		merge = require('./util/merge-object'),
		list = require('./list'),
		Fragment = require('./fragment')

function liCreator(sel, att, cnt) {
	return function constructor(opt) {
		var cfg = merge({}, att, opt)
		function coFab() {
			return new Component(createElement(sel, cfg), cfg, new Fragment(cnt))
		}
		return list(coFab)
	}
}

var li = factory(liCreator)
li.svg = factory(liCreator, {xmlns: ns.svg})

module.exports = li
