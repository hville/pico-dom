import {Extra} from './extra'
import {Lens} from './lens'
import {createTextNode} from './create-node'
import {extras} from './extras'

function addPatch(patch, node) {
	var extra = extras.get(node)
	if (!extra) extra = new Extra(node)

	if (!extra.patch) extra.patch = [patch]
	else extra.patch.push(patch)
	return node
}

export function setProperty(key, val, node) {
	// curried function if node missing
	if (!node) return function(n) { return setProperty(key, val, n) }

	// dynamic patch is value is a lens
	if (val instanceof Lens) return addPatch(function(n, v,k,o) {
		return setProperty(key, val.get(v,k,o), n)
	}, node)

	// normal
	if (node[key] !== val) node[key] = val
	return node
}

export function setText(txt, node) {
	// curried function if node missing
	if (!node) return function(n) { return setText(txt, n) }

	// dynamic patch is value is a lens
	if (txt instanceof Lens) return addPatch(function(n, v,k,o) {
		return setText(txt.get(v,k,o), n)
	}, node)

	// normal
	var child = node.firstChild
	if (child && !child.nextSibling) {
		if (child.nodeValue !== txt) child.nodeValue = txt
	}
	else node.textContent = txt
	return node
}

export function setAttribute(key, val, node) {
	// curried function if node missing
	if (!node) return function(n) { return setAttribute(key, val, n) }

	// dynamic patch is value is a lens
	if (val instanceof Lens) return addPatch(function(n, v,k,o) {
		return setAttribute(key, val.get(v,k,o), n)
	}, node)

	// normal
	if (val === false) node.removeAttribute(key)
	else node.setAttribute(key, val === true ? '' : val)
	return node
}

export function addChild(child, parent) {
	if (child instanceof Lens) throw Error('childLens not supported')
	if (!parent) return function(n) { return addChild(child, n) }
	switch(child == null ? child : child.constructor || Object) { //eslint-disable-line eqeqeq
		case null: case undefined:
			return parent
		case Array:
			for (var i=0; i<child.length; ++i) addChild(child[i], parent)
			return parent
		case Number:
			parent.appendChild(createTextNode(''+child))
			return parent
		case String:
			parent.appendChild(createTextNode(child))
			return parent
		default:
			var extra = extras.get(child)
			if (extra) extra.moveTo(child, parent)
			else if (child.nodeType) parent.appendChild(child)
			else throw Error ('unsupported child type ' + typeof child)
			return parent
	}
}
