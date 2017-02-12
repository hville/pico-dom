var reduce = require('../util/reduce'),
		ns = require('../util/namespaces')

module.exports = {
	attrs: function attrs(elm, att) {
		return att ? reduce(att, setAttr, elm) : elm
	},
	props: function props(elm, att) {
		return att ? reduce(att, setProp, elm) : elm
	},
	style: function props(elm, att) {
		return !att ? elm
		: (elm.namespaceURI && elm.namespaceURI !== ns.html) ? setAttr(elm, styleString(att), 'style')
		: reduce(att, setStyles, elm)
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
function styleString(o) {
	for (var i=0, s='', ks=Object.keys(o); i<ks.length; ++i) s += ks[i] + ':' + o[ks[i]] + ';'
	return s
}
