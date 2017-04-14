import {defaultView} from '../default-view'
import {namespaces} from '../namespaces'
import {assignOpts} from './assign-opts'
import {createTextNode} from '../create-text-node'

var rRE =/[\"\']+/g, ///[\s\"\']+/g,
		mRE = /(?:^|\.|\#)[^\.\#\[]+|\[[^\]]+\]/g

export function creator(factory) {
	return function(defaults) {
		return function define(selector) {
			// Options precedence: defaults < selector < options[0] < options[1] ...
			var options = assignOpts({}, defaults),
					content = [],
					elem = null

			// selector handling
			if (typeof selector === 'string') {
				var	matches = selector.replace(rRE, '').match(mRE)
				if (!matches) throw Error('invalid selector: '+selector)
				matches.reduce(parse, options)
				var doc = defaultView.document,
						tag = options.tagName || 'div',
						xns = options.xmlns
				elem = xns ? doc.createElementNS(xns, tag) : doc.createElement(tag)
			}
			else {
				elem = selector
			}

			// options and children
			for (var i=1; i<arguments.length; ++i) {
				var arg = arguments[i]
				if (arg && arg.constructor === Object) assignOpts(options, arg)
				else mergeChildren.call(content, arg)
			}
			return factory(elem, options, content)
		}
	}
}
function mergeChildren(arg) {
	if (arg != null) switch(ctyp(arg)) { //eslint-disable-line eqeqeq
		case Array:
			arg.forEach(mergeChildren, this)
			break
		case Number:
			this.push(createTextNode(''+arg))
			break
		case String:
			this.push(createTextNode(arg))
			break
		default: this.push(arg)
	}
}
function ctyp(t) {
	return t == null ? t //eslint-disable-line eqeqeq
		: t.constructor || Object
}
function parse(def, txt) {
	var idx = -1,
			key = ''
	if (!def.attrs) def.attrs = {}
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
				def.xmlns = namespaces[txt.slice(0,idx)]
			}
	}
	return def
}
