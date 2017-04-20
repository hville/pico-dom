//import {Lens} from '../constructors/lens'
//import {List} from '../constructors/list'
//import {Extras} from '../constructors/extras'
import {getExtra} from '../extras'
//import {cKind} from './c-kind'
//import {createTextNode, createComment} from '../create-node'
//import {moveNode} from './move-node'
import {assign} from './reduce'

// GENERAL

export function assignKey(tgt, val, key) {
	if (typeof val === 'object') tgt[key] = assign(tgt[key] || {}, val)
	else if (tgt[key] !== val) tgt[key] = val
	return tgt
}

export function setProperty(obj, val, key) {
	if (obj[key] !== val) obj[key] = val
	return obj
}

// NODE

export function setText(node, text) {
	var child = node.firstChild
	if (child && !child.nextSibling) {
		if (child.nodeValue !== text) child.nodeValue = text
	}
	else node.textContent = text
	return node
}

// ELEMENT

export function setAttribute(elm, val, key) {
	if (val === false) elm.removeAttribute(key)
	else elm.setAttribute(key, val === true ? '' : val)
	return elm
}

/*export function appendChild(elm, itm) {
	if (itm instanceof Lens) {
		var child = elm.appendChild(createComment('?'))
		return setEdit(replaceChild, elm, itm, child)
	}
	switch(cKind(itm)) {
		case null: case undefined:
			elm.appendChild(createComment(''+itm))
			return elm
		case Array:
			//return itm.reduce(appendChild, elm)??? TODO List
			throw Error('not yet supported. TODO')
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
			elm.appendChild(itm)
			return elm
	}
}*/

/*export function replaceChild(elm, itm, oldChild) {
	if (itm instanceof Lens) {
		return setEdit(replaceChild, elm, itm, oldChild)
	}
	switch(cKind(itm)) {
		case null: case undefined:
			this.key = elm.replaceChild(createComment(''+itm), oldChild)
			return elm
		case Array:
			//return itm.reduce(appendChild, elm)??? TODO List
			//for (var i=0; i<itm.length; ++i) elm.insertBefore()
			//return itm.reduce(replaceChild, elm, ???)
			throw Error('not yet supported. TODO')
		case Number:
			this.key = elm.replaceChild(createTextNode(''+itm), oldChild)
			return elm
		case String:
			this.key = elm.replaceChild(createTextNode(itm), oldChild)
			return elm
		case List:
			itm.moveList(elm, oldChild)
			moveNode(oldChild, null)
			return elm
		default:
			this.key = elm.replaceChild(itm, oldChild)
			return elm
	}
}*/

// EXTRA

/*export function setState(elm, val, key) {
	var extras = getExtra(elm, Extras),
			state = extras.state || (extras.state = {})
	if (val instanceof Lens) return setEdit(setState, elm, val, key)
	if (state[key] !== val) state[key] = val
	return elm
}*/

export function updateNode(node, v,k,o) {
	var extra = getExtra(node)
	if (extra) {
		if (extra.edits) for (var i=0; i<extra.edits.length; ++i) {
			var edit = extra.edits[i]
			node = edit.red(node, edit.get.value(v), edit.key)
		}
		if (extra.footer) return extra.footer
	}
	var child = node.firstChild
	while (child) child = updateNode(child, v,k,o).nextSibling
	return node
}

/*function setEdit(red, elm, lens, key) {
	getExtra(elm, Extras).edits.push({red: red, get:lens, key:key}) //TODO replace changes the key...
	//if (lens.data) red(elm, lens.default, key) //TODO remove?
	return elm
}*/
