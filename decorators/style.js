var reduce = require('../util/reduce'),
		ns = require('../namespaces')
/*
	Optional helper that can be added to the element decorators
*/
module.exports = function style(elm, val) {
	var isNS = !elm.namespaceURI || elm.namespaceURI === ns.html,
			styp = typeof val
	if (styp === 'string') {
		if (isNS) this.attrs(elm, {key: val})
		else elm.style.cssText = val
		return elm
	}
	else {
		if (isNS) this.attrs(elm, {key: reduce(val, styleString, '')})
		else reduce(val, setStyles, elm)
		return elm
	}
}
function setStyles(elm, val, key) {
	if (elm.style[key] !== val) elm.style[key] = val
	return elm
}
function styleString(str, val, key) {
	return str += key + ':' + val + ';'
}
