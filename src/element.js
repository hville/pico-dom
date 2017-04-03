var ENV = require('./env'),
		NS = require('./namespaces'),
		decorators = require('./decorators'),
		reduce = require('./util/reduce')

var rRE =/[\"\']+/g, ///[\s\"\']+/g,
		mRE = /(?:^|\.|\#)[^\.\#\[]+|\[[^\]]+\]/g

/**
 * Parse a CSS-style selector string and return a new Element
 * @param {Object|String} selector - css like selector string
 * @param {Array} configs - The existing definition to be augmented
 * @param {Array} [children] - Element children Nodes,Factory,Text
 * @returns {Object} - The parsed element definition [sel,att]
 */
module.exports = function element(selector, configs, children) {
	var node = getNode(selector, configs)
	children.forEach(addChild, node)
	return node
}
function addChild(child) {
	if (child.moveto) child.moveto(this)
	else this.appendChild(child)
}
function getNode(selector, configs) {
	if (typeof selector === 'string') return fromString(selector, configs)
	if (selector.nodeType) return decorate(selector, configs, decorators)
	throw Error('invalid selector: ' + typeof selector)
}
function fromString(selector, configs) {
	var parsed = {attrs:{}},
			matches = selector.replace(rRE, '').match(mRE)
	if (!matches) throw Error('invalid selector: '+selector)

	matches.reduce(parse, parsed)
	configs.push(parsed)

	var doc = ENV.document,
			tag = getLast(configs, 'tagName') || 'div',
			xns = getLast(configs, 'xmlns'),
			elm = xns ? doc.createElementNS(xns, tag) : doc.createElement(tag)
	return decorate(elm, configs, decorators)
}
function getLast(arr, key) {
	var res = arr[0][key]
	for (var i=1; i<arr.length; ++i) if (arr[i][key]) res = arr[i][key]
	return res
}
function parse(def, txt) {
	var idx = -1,
			key = ''
	switch (txt[0]) {
		case '[':
			idx = txt.indexOf('=')
			key = txt.slice(1, idx)
			if (idx === -1) def.attrs[key] = true
			else if (idx === txt.length-2) def.attrs[key] = false
			else {
				var val = txt.slice(idx+1, -1)
				if (key === 'xmlns') def.xmlns = val
				else def.attrs[key] = val
			}
			break
		case '.':
			key = txt.slice(1)
			if (def.attrs.class) def.attrs.class += ' ' + key
			else def.attrs.class = key
			break
		case '#':
			def.attrs.id = txt.slice(1)
			break
		default:
			idx = txt.indexOf(':')
			if (idx === -1) def.tagName = txt
			else {
				def.tagName = txt.slice(idx+1)
				def.xmlns = NS[txt.slice(0,idx)]
			}
	}
	return def
}
function decorate(elem, cfgs, decs) {
	for (var i=0; i<cfgs.length; ++i) reduce(decs, applyItem, elem, cfgs[i])
	return elem
}
function applyItem(elm, dec, key) {
	return this[key] ? dec(elm, this[key], key) : elm
}
