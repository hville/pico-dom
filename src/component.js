import EXTRA from './extra'
import cloneChildren from './util/clone-child'

export default Component

/**
 * @constructor
 * @param {Object} node - DOM node
 * @param {Object} [extra] - configuration
 * @param {*} [key] - optional data key
 * @param {number} [idx] - optional position index
 */
function Component(node, extra, key, idx) {
	this.update = updateChildren
	//decorate: key, init, update, onmove, handleEvents...
	if (extra) for (var i=0, ks=Object.keys(extra); i<ks.length; ++i) this[ks[i]] = extra[ks[i]]
	if (key !== void 0) this.key = key

	// register and init
	this.node = node
	EXTRA.set(node, this)
	if (this.init) this.init(key, idx)
}
Component.prototype = {
	constructor: Component,
	clone: function clone(k, i) {
		var sourceNode = this.node,
				targetNode = sourceNode.cloneNode(false)
		cloneChildren(targetNode, sourceNode.firstChild)
		return new Component(targetNode, this, k, i)
	},
	updateChildren: updateChildren,
	moveto: function moveto(parent, before) {
		var node = this.node,
				oldParent = node.parentNode
		if (parent) parent.insertBefore(node, before || null)
		else if (oldParent) oldParent.removeChild(node)
		if (this.onmove) this.onmove(oldParent, parent)
		return node
	},
	setText: function setText(text) {
		var node = this.node,
				child = node.firstChild
		if (child && !child.nextSibling && child.nodeValue !== text) child.nodeValue = text
		else node.textContent = text
	}
}
function updateChildren() {
	var ptr = this.node.firstChild
	while (ptr) {
		var extra = EXTRA.get(ptr)
		if (extra) {
			extra.update.apply(extra, arguments)
			ptr = (extra.footer || ptr).nextSibling
		}
		else ptr = ptr.nextSibling
	}
	return this
}
