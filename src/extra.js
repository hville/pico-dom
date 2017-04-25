import {extras} from './extras'
import {assign} from './util/reduce'
import {cloneChildren} from './clone-node'
import {updateChildren} from './update'

/**
 * @constructor
 * @param {Object} node - DOM node
 * @param {Object} [extra] - configuration
 * @param {*} [key] - optional data key
 * @param {number} [idx] - optional position index
 */
export function Extra(node, extra) {
	extras.set(node, this)
	if (extra) assign(this, extra)
	//TODO init
}

var extraP = Extra.prototype

extraP.patch = null
extraP.init = null //TODO

extraP.clone = function(node, deep) {
	var copy = node.cloneNode(false)
	// copy tree before creating initiating the new Extra
	if (deep !== false) cloneChildren(node, copy)
	new Extra(copy, this)
	return copy
}

extraP.update = function(node, v,k,o) {
	this.updateSelf(node, v,k,o)
	updateChildren(node, v,k,o)
}

extraP.updateSelf = function(node, v,k,o) {
	if (this.patch) for (var i=0; i<this.patch.length; ++i) this.patch[i](node, v,k,o)
	return node
}

extraP.moveTo = function(node, parent, before) {
	var oldParent = node.parentNode
	if (parent) parent.insertBefore(node, before || null)
	else if (oldParent) oldParent.removeChild(node)
	if (this.onmove) this.onmove(oldParent, parent)
	return this
}
