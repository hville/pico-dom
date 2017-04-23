import {extras} from './extras'
import {assign} from './util/reduce'
import {cloneChildren} from './clone-node'

/**
 * @constructor
 * @param {Object} node - DOM node
 * @param {Object} [extra] - configuration
 * @param {*} [key] - optional data key
 * @param {number} [idx] - optional position index
 */
export function Extra(node, extra) {
	this.node = node
	extras.set(node, this)
	if (extra) assign(this, extra)
	//TODO init
}

var extraP = Extra.prototype

extraP.patch = null
extraP.init = null //TODO

extraP.clone = function clone(node, deep) {
	var copy = node.cloneNode(false)
	// copy tree before creating initiating the new Extra
	if (deep !== false) cloneChildren(node, copy)
	return (new Extra(node, this)).node
}

extraP.update = function update(node, v,k,o) {
	if (this.patch) for (var i=0; i<this.patch.length; ++i) this.patch[i](node, v,k,o)
	return node
}

extraP.moveTo = function moveTo(node, parent, before) {
	var oldParent = node.parentNode
	if (parent) parent.insertBefore(node, before || null)
	else if (oldParent) oldParent.removeChild(node)
	if (this.onmove) this.onmove(oldParent, parent)
	return this
}
