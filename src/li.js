var factory = require('./util/factory'),
		co = require('./co'),
		List = require('./list'),
		ns = require('./util/namespaces'),
		createElement = require('./el/create-element'),
		Config = require('./util/config'),
		createChild = require('./util/create-child')

function liCreator(sel, att, cnt) {
	return function constructor(opt) {
		var cofcn = co(sel, opt ? new Config(att, opt) : att, cnt)
		return new List(cofcn)
	}
}

var li = factory(liCreator)
li.svg = factory(liCreator, {xmlns: ns.svg})

module.exports = li
