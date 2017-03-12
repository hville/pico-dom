var reduce = require('../util/reduce'),
		ns = require('../namespaces'),
		ctyp = require('../util/ctyp')

module.exports = {
	attrs: function(elm, val) {
		return val ? reduce(val, setAttr, elm) : elm
	},
	props: function(elm, val) {
		return val ? reduce(val, setProp, elm) : elm
	},
	style: function(elm, val, key) {
		var isNS = !elm.namespaceURI || elm.namespaceURI === ns.html
		switch (ctyp(val)) {
			case String:
				if (isNS) setAttr(elm, val, key)
				else elm.style.cssText = val
				return elm
			case Object:
				if (isNS) setAttr(elm, reduce(val, styleString, ''), key)
				else reduce(val, setStyles, elm)
				return elm
		}
		throw Error('invalid attribute: style:' + typeof val)
	},
	class: function(elm, val, key) {
		var isNS = !elm.namespaceURI || elm.namespaceURI === ns.html,
				typ = ctyp(val),
				txt = typ === String ? val : typ === Array ? val.join(' ') : undefined
		if (!txt) throw Error('invalid attribute: style:' + typeof val)
		return isNS ? setAttr(elm, txt, key) : setProp(elm, txt, 'className')
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
