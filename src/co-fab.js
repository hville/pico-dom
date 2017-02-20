var creator = require('./util/creator'),
		Component = require('./component'),
		element = require('./element'),
		Fragment = require('./fragment')

module.exports = creator(function co(sel, cfg, cnt) {
	return new Component(element(sel, cfg), cfg, new Fragment(cnt))
})
