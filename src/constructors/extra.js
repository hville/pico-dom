import {extras} from '../extras'
import {assign} from '../util/reduce'
import {cloneNode} from '../clone-node'

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

extraP.clone = function clone() {
	return cloneNode(this.node) //TODO
}

extraP.update = function update(node) {
	if (this.patch) for (var i=0; i<this.patch.length; ++i) this.patch[i].apply(this, arguments)
	return node
}

extraP.moveTo = function moveTo(parent, before) {
	var node = this.node,
			oldParent = node.parentNode
	if (parent) parent.insertBefore(node, before || null)
	else if (oldParent) oldParent.removeChild(node)
	if (this.onmove) this.onmove(oldParent, parent)
	return this
}
