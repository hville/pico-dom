import {Extra} from './constructors/extra'
import {Lens} from './constructors/lens'
import {cKind} from './util/c-kind'
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
	if (val instanceof Lens) return addPatch(function() {
		return setProperty(key, val.get.apply(val, arguments), this)
	}, node)

	// normal
	if (node[key] !== val) node[key] = val
	return node
}

export function setText(txt, node) {
	// curried function if node missing
	if (!node) return function(n) { return setText(txt, n) }

	// dynamic patch is value is a lens
	if (txt instanceof Lens) return addPatch(function() {
		return setText(txt.get.apply(txt, arguments), this)
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
	if (val instanceof Lens) return addPatch(function() {
		return setAttribute(key, val.get.apply(val, arguments), this)
	}, node)

	// normal
	if (val === false) node.removeAttribute(key)
	else node.setAttribute(key, val === true ? '' : val)
	return node
}

export function addChild(child, parent) {
	if (child instanceof Lens) throw Error('childLens not supported')
	if (!parent) return function(n) { return addChild(child, n) }
	switch(cKind(child)) {
		case null: case undefined:
			return parent
		case Array:
			return child.reduce(addChild, parent)
		case Number:
			parent.appendChild(createTextNode(''+child))
			return parent
		case String:
			parent.appendChild(createTextNode(child))
			return parent
		default:
			if (child.moveTo) child.moveTo(parent)
			else if (child.nodeType) parent.appendChild(child)
			else throw Error ('unsupported child type ' + typeof child)
			return parent
	}
}
