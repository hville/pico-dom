var ENV = require('../env'),
		NS = require('../namespaces'),
		ctyp = require('../util/ctyp'),
		decorate = require('../util/decorate'),
		decorators = require('./decorators')

var rRE =/[\"\']+/g, ///[\s\"\']+/g,
		mRE = /(?:^|\.|\#)[^\.\#\[]+|\[[^\]]+\]/g

function text(string) {
	return ENV.document.createTextNode(string)
}

/**
 * Parse a CSS-style selector string and return a new Element
 * @param {Object|Function|String} selector - css like selector string
 * @param {Object} [options] - The existing definition to be augmented
 * @param {Array} [children] - Element children Nodes,Factory,Text
 * @returns {Object} - The parsed element definition [sel,att]
 */
module.exports = function element(selector, options, children) {
	var styp = ctyp(selector)

	var node = styp === ENV.Node ? decorate(selector, options, decorators)
		: styp === Function ? selector(options)
		: styp !== String ? null
		: selector === '#' ? text('')
		: selector === '!' ? ENV.document.createComment('')
		: fromString(selector, options)
	if (!node) throw Error('invalid selector: ' + typeof selector)

	var childQty = children.length,
			isText = childQty === 1 && ctyp(children[0], String, Number)

	if (childQty) {
		if (isText && !node.hasChildNodes()) node.textContent = ''+children[0]
		else for (var i=0; i<childQty; ++i) {
			var cnt = getChild(children[i])
			if (cnt) {
				if (cnt.moveto) cnt.moveto(node)
				else node.appendChild(cnt)
			}
		}
	}
	return node
}
function getChild(itm) {
	switch (ctyp(itm)) {
		case Function: return getChild(itm())
		case Number: return text(''+itm)
		case String: return itm === '' ? null : text(itm)
		default: return itm
	}
}
function fromString(selector, options) {
	var matches = selector.replace(rRE, '').match(mRE)
	if (!matches) throw Error('invalid selector: '+selector)
	if (!options) options = {attrs:{}}
	else if (!options.attrs) options.attrs = {}
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
