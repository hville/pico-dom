var factory = require('./util/factory'),
		Component = require('./component'),
		createElement = require('./element'),
		merge = require('./util/merge-object'),
		Fragment = require('./fragment')

module.exports = function coCreator(def) {
	return factory(function co(sel, att, cnt) {
		return function constructor(opt) {
			var cfg = merge({}, def, att, opt),
					elm = createElement(sel, cfg)
			return new Component(elm, cfg, new Fragment(cnt))
		}
	})
}
