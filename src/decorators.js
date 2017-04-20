import {reduce} from './util/reduce'
import {Component} from './constructors/component'
import {Lens} from './constructors/lens'
import {getNode, getExtra} from './extras'
import {cKind} from './util/c-kind'
import {createTextNode} from './create-node'
import {setAttribute, setProperty} from './util/reducers'

export var decorators = {
	attrs: function(elm, obj) {
		return obj ? reduce(obj, parseValue, elm, setAttribute) : elm
	},
	props: function(elm, obj) {
		return obj ? reduce(obj, parseValue, elm, setProperty) : elm
	},
	children: function(elm, arr) {
		return arr ? reduce(arr, parseValue, elm, setChild) : elm
	},
	extra: function(elm, obj) {
		return obj ? reduce(obj, setExtra, elm) : elm
	}
	/*state: function(elm, obj) {
		return obj ? reduce(obj, parseValue, elm, setState) : elm
	}*/
}
function parseValue(elm, val, key) {
	var fcn = this
	if (val instanceof Lens) return setEdit(fcn, elm, val, key)
	else return fcn(elm, val, key)
}
/*
	TODO for children, autoUpdate setChild => replaceChild
*/
export function setExtra(elm, val, key) {
	if (val instanceof Lens) return setEdit(setExtra, elm, val, key)
	var extras = getExtra(elm, Component)
	extras[key] = val
	return elm
}

function setChild(elm, itm) {
	if (itm instanceof Lens) throw Error('childCursor not supported')
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

function setEdit(dec, elm, cur, key) {
	var extra = getExtra(elm, Component)
	extra.updaters.push({fcn:dec, cur:cur, key:key})
	return dec(elm, cur.value(), key)
}
/*
function setEdit(red, elm, lens, key) {
	getExtra(elm, Extras).edits.push({red: red, get:lens, key:key}) //TODO replace changes the key...
	//if (lens.data) red(elm, lens.default, key) //TODO remove?
	return elm
}
*/

