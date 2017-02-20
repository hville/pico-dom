var G = require('./util/root'),
		NS = require('./util/namespaces'),
		typ = require('./util/typ'),
		getChildItems = require('./util/get-child-items'),
		reduce = require('./util/reduce'),
		decorators = require('./el/decorators')

/**
 * @const {!Object}
 */
var rRE =/[\s\"\']+/g,
		mRE = /(?:^|\.|\#)[^\.\#\[]+|\[[^\]]+\]/g

/**
 * Parse a CSS-style selector string and return a new Element
 * @param {Object|Function|String} selector - css like selector string
 * @param {Object} [options] - The existing definition to be augmented
 * @param {Array} [children] - Element children Nodes,Factory,Text
 * @returns {Object} - The parsed element definition [sel,att]
 */
module.exports = function element(selector, options, children) {
	var elem = createElement(selector, options)
	if (children) getChildItems(children).forEach(appendChild, elem)
	return elem
}
function appendChild(item) {
	if (typ(item) === G.Node) this.appendChild(item)
	else if(item.node) this.appendChild(item.node)
	else if (item.content) item.content.forEach(appendChild, this)
}
function createElement(selector, options) {
	switch(typ(selector)) {
		case G.Node:
			return decorate(selector, options)
		case String:
			return fromString(selector, options)
		case Function:
			return selector(options)
		default:
			throw Error('invalid selector: ' + typeof selector)
	}
}
function fromString(selector, options) {
	var matches = selector.replace(rRE, '').match(mRE)
	if (!matches) throw Error('invalid selector: '+selector)
	if (!options) options = {attrs:{}}
	else if (!options.attrs) options.attrs = {}
	matches.reduce(parse, options)
	var doc = G.document,
			tag = options.tagName || 'div',
			elm = options.xmlns ? doc.createElementNS(options.xmlns, tag) : doc.createElement(tag)
	return decorate(elm, options)
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
function decorate(elem, opts) {
	return !opts ? elem : reduce(decorators, applyItem, elem, opts)
}
function applyItem(elm, dec, key) {
	return this[key] ? dec(elm, this[key]) : elm
}
