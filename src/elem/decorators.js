var reduce = require('../util/reduce'),
		ns = require('../util/namespaces'),
		typ = require('../util/typ')

var attrOnly = new Set(['form', 'list', 'files', 'labels', 'href', 'width', 'height'])

module.exports = {
	attrs: function attrs(elm, val) {
		return val ? reduce(val, setAttr, elm) : elm
	},
	props: function props(elm, val) {
		return val ? reduce(val, setProp, elm) : elm
	},
	style: function props(elm, val) {
		var isHTML = !elm.namespaceURI || elm.namespaceURI === ns.html
		if (isHTML) switch (typ(val)) {
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
	},
	automatic: function automatic(elem, opts) {
		return !opts ? elem
			: (elem.namespaceURI && elem.namespaceURI !== ns.html) ? reduce(opts, applyItemNS, elem)
			: reduce(opts, applyItem, elem)
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
function applyItemNS(elm, val, key) {
	if (module.exports[key]) return module.exports[key](elm, val)
	switch (typ(val)) {
		case String: case Number: case Boolean:
			return setAttr(elm, val, key)
		case Function:
			if (key[0] === 'o' && key[1] === 'n') return setProp(elm, val, key)
	}
	throw Error('invalid attributeNS ' + key + ':' + typeof val)
}
function styleString(str, val, key) {
	return str += key + ':' + val + ';'
}
function applyItem(elm, val, key) {
	if (module.exports[key]) return module.exports[key](elm, val)
	switch (typ(val)) {
		case String: case Number: case Boolean:
			return (attrOnly.has(key) || !(key in elm)) ? setAttr(elm, val, key) : setProp(elm, val, key)
		case Function:
			if (key[0] === 'o' && key[1] === 'n') return setProp(elm, val, key)
			break
		case Object:
			return (key === 'class' || key === 'classList') ? reduce(val, setClasses, elm) : setProp(elm, val, key)
	}
	throw Error('invalid attribute ' + key + ':' + typeof val)
}
function setClasses(elm, key, val) { // k === 'class'
	var classList = elm.classList
	for (var i=0; i<classList.length; ++i) {
		var item = classList.item(i)
		if (!val[item]) classList.remove(item)
	}
	reduce(val, setClass, classList)
}
function setClass(cList, val, key) {
	if (val) cList.add(key)
	else cList.remove(key)
}
