var reduce = require('../util/reduce'),
		ns = require('../util/namespaces'),
		typ = require('../util/typ')

module.exports = {
	attrs: function attrs(elm, val) {
		return val ? reduce(val, setAttr, elm) : elm
	},
	props: function props(elm, val) {
		return val ? reduce(val, setProp, elm) : elm
	},
	style: function props(elm, val) {
		var isNS = !elm.namespaceURI || elm.namespaceURI === ns.html
		switch (typ(val)) {
			case String:
				if (isNS) setAttr(elm, val, 'style')
				else elm.style.cssText = val
				return elm
			case Object:
				if (isNS) setAttr(elm, reduce(val, styleString, ''), 'style')
				else reduce(val, setStyles, elm)
				return elm
		}
		throw Error('invalid attribute: style:' + typeof val)
	}
}
function setAttr(elm, val, key) {
	if (val === false) elm.removeAttribute(key)
	else elm.setAttribute(key, val === true ? '' : val)
	return elm
}
function setProp(elm, val, key) {
	if (elm[key] !== val) elm[key] = val
	return elm
}
function setStyles(elm, val, key) {
	if (elm.style[key] !== val) elm.style[key] = val
	return elm
}
function styleString(str, val, key) {
	return str += key + ':' + val + ';'
}
