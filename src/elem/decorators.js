var decorators = {
	dataset: setObj,
	attributes: setAttributes, attrs: setAttributes,
	properties: setProperties, props: setProperties,
	style: function setStyle(e, k, v) { // k === 'style'
		if (e.namespaceURI) e.setAttribute(k, styleString(v))
		else if (typeof v === 'object') setObj(e, k, v)
		else e[k].cssText = v
	}
}

module.exports = decorators

// general and dataset
function setObj(e, k, o) {
	for (var ki in o) e[k][ki] = o[ki]
}
// attributes
function setAttributes(e, k, o) {
	for (var ki in o) setAttribute(e, ki, o[ki])
}
function setAttribute(e, k, v) {
	var cIdx = k.indexOf(':')
	if (cIdx >= 0) {
		var ns = k.slice(0, cIdx),
				ln = k.slice(cIdx+1)
		if (v === false) e.removeAttributeNS(ns, ln)
		else e.setAttributeNS(ns, ln, v === true ? '' : v)
	}
	else {
		if (v === false) e.removeAttribute(k)
		else e.setAttribute(k, v === true ? '' : v)
	}
}
// properties
function setProperties(e, k, o) {
	for (var ki in o) e[ki] = o[ki]
}
// style
function styleString(o) {
	for (var i=0, s='', ks=Object.keys(o); i<ks.length; ++i) s += ks[i] + ':' + o[ks[i]] + ';'
	return s
}
