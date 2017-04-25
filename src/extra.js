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
	if (extra) assign(this, extra)
	this.node = node
	extras.set(node, this)
	//TODO init
}

var extraP = Extra.prototype

extraP.patch = null
extraP.init = null //TODO

extraP.clone = function(deep) {
	var copy = this.node.cloneNode(false)
	// copy tree before creating initiating the new Extra
	if (deep !== false) cloneChildren(this.node, copy)
	new Extra(copy, this)
	return copy
}

extraP.update = function(v,k,o) {
	this.updateSelf(v,k,o)
	this.updateChildren(v,k,o)
}
extraP.updateChildren = function(v,k,o) {
	updateChildren(this.node, v,k,o)
}

extraP.updateSelf = function(v,k,o) {
	if (this.patch) for (var i=0; i<this.patch.length; ++i) this.patch[i].call(this.node, v,k,o)
	return this.node
}

extraP.moveTo = function(parent, before) {
	var node = this.node,
			oldParent = node.parentNode
	if (parent) parent.insertBefore(node, before || null)
	else if (oldParent) oldParent.removeChild(node)
	if (this.onmove) this.onmove(oldParent, parent)
	return this
}
