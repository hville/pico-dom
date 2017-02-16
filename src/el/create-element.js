var G = require('../util/root'),
		decorate = require('./decorate'),
		NS = require('../util/namespaces'),
		typ = require('../util/typ')

var rRE =/[\s\"\']+/g,
		mRE = /(?:^|\.|\#)[^\.\#\[]+|\[[^\]]+\]/g

/**
 * Parse a CSS-style selector string and return a new Element
 * @param {string} xmlns - namespace URL
 * @param {*} selector - css like selector string
 * @param {Object} [options] - The existing definition to be augmented
 * @returns {Object} - The parsed element definition [sel,att]
 */
module.exports = function createElement(xmlns, selector, options) {
	switch(typ(selector)) {
		case G.Node:
			return decorate(selector.cloneNode(false), options)
		case String:
			return fromString(xmlns, selector, options)
		case Function:
			return selector(options)
		default:
			throw Error('invalid selector: ' + typeof selector)
	}
}
function fromString(xmlns, selector, options) {
	var matches = selector.replace(rRE, '').match(mRE)
	if (!matches) throw Error('invalid selector: '+selector)
	if (!options) options = {attrs:{}}
	else if (!options.attrs) options.attrs = {}
	var def = matches.reduce(parse, {
		tag: '',
		xns: xmlns,
		att: options.attrs
	})
	var doc = G.document,
			tag = def.tag || 'div',
			elm = def.xns ? doc.createElementNS(def.xns, tag) : doc.createElement(tag)
	return decorate(elm, options)
}
function parse(res, txt) {
	var idx = -1,
			key = ''
	switch (txt[0]) {
		case '[':
			idx = txt.indexOf('=')
			key = txt.slice(1, idx)
			if (idx === -1) res.att[key] = true
			else if (idx === txt.length-2) res.att[key] = false
			else {
				var val = txt.slice(idx+1, -1)
				if (key === 'xmlns') res.xns = val
				else res.att[key] = val
			}
			break
		case '.':
			key = txt.slice(1)
			if (res.att.class) res.att.class += ' ' + key
			else res.att.class = key
			break
		case '#':
			res.att.id = txt.slice(1)
			break
		default:
			idx = txt.indexOf(':')
			if (idx === -1) res.tag = txt
			else {
				res.tag = txt.slice(idx+1)
				res.xns = NS[txt.slice(0,idx)]
			}
			break
	}
	return res
}
