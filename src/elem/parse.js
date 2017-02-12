var rRE =/[\s\"\']+/g,
		mRE = /(?:^|\.|\#)[^\.\#\[]+|\[[^\]]+\]/g

/**
 * Parse a CSS-style selector string and return {prefix, tag, xmlns, attributes}
 * @param {string} selectorString - The seed selector string
 * @param {Object} [optionalContect] - The existing definition to be augmented
 * @returns {Object} - The parsed element definition
 */
module.exports = function parse(selectorString, optionalContect) {
	var res = optionalContect || {},
			lst = selectorString.replace(rRE, '').match(mRE)
	return lst ? lst.reduce(add, res) : res
}

function add(res, txt) {
	var idx = -1,
			key = ''
	switch (txt[0]) {
		case '[':
			idx = txt.indexOf('=')
			key = txt.slice(1, idx)
			if (!res.attributes) res.attributes = {}
			if (idx === -1) res.attributes[key] = true
			else if (idx === txt.length-2) res.attributes[key] = false
			else {
				var val = txt.slice(idx+1, -1)
				if (key === 'xmlns') res.xmlns = val
				else res.attributes[key] = val
			}
			return res
		case '.':
			key = txt.slice(1)
			if (!res.attributes) res.attributes = {class: key}
			else if (res.attributes.class) res.attributes.class += ' ' + key
			else res.attributes.class = key
			return res
		case '#':
			if (!res.attributes) res.attributes = {}
			res.attributes.id = txt.slice(1)
			return res
		default:
			idx = txt.indexOf(':')
			if (idx === -1) res.tag = txt
			else {
				res.tag = txt.slice(idx+1)
				res.prefix = txt.slice(0,idx)
			}
			return res
	}
}
