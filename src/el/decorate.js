var reduce = require('../util/reduce'),
		decorators = require('./decorators')

module.exports = function decorate(elem, opts) {
	return !opts ? elem : reduce(decorators, applyItem, elem, opts)
}
function applyItem(elm, dec, key) {
	return this[key] ? dec(elm, this[key]) : elm
}


/*
var attrOnly = new Set(['form', 'list', 'files', 'labels', 'href', 'width', 'height'])

function automatic(elem, opts) {
	return !opts ? elem
		: (elem.namespaceURI && elem.namespaceURI !== ns.html) ? reduce(opts, applyItemNS, elem)
		: reduce(opts, applyItem, elem)
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
*/
