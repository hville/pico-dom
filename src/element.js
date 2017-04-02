var ENV = require('./env'),
		NS = require('./namespaces'),
		decorators = require('./decorators'),
		reduce = require('./util/reduce')

var rRE =/[\"\']+/g, ///[\s\"\']+/g,
		mRE = /(?:^|\.|\#)[^\.\#\[]+|\[[^\]]+\]/g

/**
 * Parse a CSS-style selector string and return a new Element
 * @param {Object|String} selector - css like selector string
 * @param {Object} [options] - The existing definition to be augmented
 * @param {Array} [children] - Element children Nodes,Factory,Text
 * @returns {Object} - The parsed element definition [sel,att]
 */
module.exports = function element(selector, options, children) {
	var node = getNode(selector, options)
	children.forEach(addChild, node)
	return node
}
function addChild(child) {
	if (child.moveto) child.moveto(this)
	else this.appendChild(child)
}
function getNode(selector, options) {
	if (typeof selector === 'string') return fromString(selector, options||{attrs:{}})
	if (selector.nodeType) return decorate(selector, options, decorators)
	throw Error('invalid selector: ' + typeof selector)
}
function fromString(selector, options) {
	var matches = selector.replace(rRE, '').match(mRE)
	if (!matches) throw Error('invalid selector: '+selector)
	if (!options.attrs) options.attrs = {}
	matches.reduce(parse, options)
	var doc = ENV.document,
			tag = options.tagName || 'div',
			elm = options.xmlns ? doc.createElementNS(options.xmlns, tag) : doc.createElement(tag)
	return decorate(elm, options, decorators)
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
function decorate(elem, opts, decs) {
	return !opts ? elem : reduce(decs, applyItem, elem, opts)
}
function applyItem(elm, dec, key) {
	return this[key] ? dec(elm, this[key], key) : elm
}
