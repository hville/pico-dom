import {reduce} from './util/reduce'
import {Lens} from './constructors/lens'
import {List} from './constructors/list'
import {Extras} from './constructors/extras'
import {getExtra} from './extras'
import {cKind} from './util/c-kind'
import {createTextNode} from './create-text-node'
import {moveNode} from './move-node'

export var decorators = {
	attrs: function(elm, obj) {
		return obj ? reduce(obj, parseValue, elm, setAttr) : elm
	},
	props: function(elm, obj) {
		return obj ? reduce(obj, parseValue, elm, setProp) : elm
	},
	children: function(elm, arr) {
		return arr ? reduce(arr, parseValue, elm, setChild) : elm
	},
	state: function(elm, obj) {
		return obj ? reduce(obj, parseValue, elm, setState) : elm
	}
}
function parseValue(elm, val, key) {
	var fcn = this
	if (val instanceof Lens) return setEdit(elm, fcn, val, key)
	else return fcn(elm, val, key)
}
/*
	TODO for children, autoUpdate setChild => replaceChild
*/
export function setAttr(elm, val, key) {
	if (val === false) elm.removeAttribute(key)
	else elm.setAttribute(key, val === true ? '' : val)
	return elm
}
export function setProp(elm, val, key) {
	if (elm[key] !== val) elm[key] = val
	return elm
}
export function setState(elm, val, key) {
	var extras = getExtra(elm, Extras),
			state = extras.state || (extras.state = {})
	state[key] = val
	return elm
}

function setChild(elm, itm) {
	if (itm instanceof Lens) throw Error('childCursor not supported')
	/*  CreateCommentNode
			add "replaceNode" updater:
			* null/undef > comment
			* Array > list
			* Number/String >textNode
			* List
			* Node > simple
	*/
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
		case List:
			itm.moveList(elm)
			return elm
		default:
			moveNode(itm, elm)
			return elm
	}
}

function setEdit(elm, set, lens, key) {
	var extra = getExtra(elm, Extras),
			updater = {set: set, get:lens, key:key}
	extra.edits.push(updater)
	if (lens.data) set(elm, lens.default, key)
	return elm
}
