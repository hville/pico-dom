import {reduce} from './util/reduce'
import {Component} from './constructors/component'
import {Pick} from './constructors/pick'
import {getNode, getExtra, setExtra} from './node-extra'
import {cKind} from './util/c-kind'
import {createTextNode} from './create-text-node'

export var decorators = {
	attrs: function(elm, obj) {
		return obj ? reduce(obj, setAttr, elm) : elm
	},
	props: function(elm, obj) {
		return obj ? reduce(obj, setProp, elm) : elm
	},
	children: function(elm, arr) {
		return arr ? arr.reduce(setChild, elm, setChild) : elm
	},
	extra: function(elm, obj) {
		return obj ? reduce(obj, setExtra, elm) : elm
	}
}
/*
	TODO for children, autoUpdate setChild => replaceChild
*/
function setAttr(elm, val, key) {
	if (val instanceof Pick) return setComponent(setAttr, elm, val, key)

	if (val === false) elm.removeAttribute(key)
	else elm.setAttribute(key, val === true ? '' : val)
	return elm
}
export function setProp(elm, val, key) {
	if (val instanceof Pick) return setComponent(setProp, elm, val, key)

	if (elm[key] !== val) elm[key] = val
	return elm
}

function setChild(elm, itm) {
	if (itm instanceof Pick) throw Error('childCursor not supported')
	switch(cKind(itm)) {
		case null: case undefined:
			return elm
		case Array:
			return itm.reduce(setChild, elm)
		case Number:
			elm.appendChild(createTextNode(''+itm))
			return elm
		case String:
			elm.appendChild(createTextNode(itm))
			return elm
		default:
			if (itm.moveTo) itm.moveTo(elm)
			else elm.appendChild(getNode(itm))
			return elm
	}
}

function setComponent(dec, elm, cur, key) {
	var extra = getExtra(elm, Component)
	extra.updaters.push({fcn:dec, cur:cur, key:key})
	return dec(elm, cur.value(), key)
}

