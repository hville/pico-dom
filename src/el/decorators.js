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
		if (!elm.namespaceURI || elm.namespaceURI === ns.html) switch (typ(val)) {
			case String:
				elm.style.cssText = val
				return elm
			case Object:
				return reduce(val, setStyles, elm)
		}
		else switch (typ(val)) {
			case String:
				return setAttr(elm, val, 'style')
			case Object:
				return setAttr(elm, reduce(val, styleString, ''), 'style')
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
