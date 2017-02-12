var dom = require('../root/root'),
		namespaces = require('../util/namespaces'),
		typ = require('../util/typ'),
		setChildren = require('./set-children'),
		decorators = require('./decorators')

module.exports = getElement

function getElement(elm, def, cnt) {
	var el = element(elm, def)
	if (def) for (var k in decorators) {
		if (def[k]) decorators[k](el, k, def[k])
	}
	if (cnt && cnt.length) setChildren(el, cnt)
	return el
}
function element(elm, def) {
	switch (typ(elm)) {
		case typ.E:
			return elm.cloneNode(true)
		case typ.F:
			return elm(def)
		default:
			var xmlns = def.xmlns || namespaces[def.prefix],
					doc = dom.document,
					tag = def.tag || 'div'
			return xmlns ? doc.createElementNS(xmlns, tag) : doc.createElement(tag)
	}
}
