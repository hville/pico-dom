var mapEC = require('./env').extra,
		cloneChildren = require('./util/clone-child'),
		ENV = require('./env')

module.exports = Component

/**
 * @constructor
 * @param {Object} node - DOM node
 * @param {Object} [extra] - configuration
 * @param {Object} [input] - init value
 */
function Component(node, extra, input) {
	this.node = node
	this.update = updateChildren
	//decorate: key, init, update, onmove, handleEvents
	if (extra) for (var i=0, ks=Object.keys(extra); i<ks.length; ++i) this[ks[i]] = extra[ks[i]]
	// register and init
	mapEC.set(node, this)
	if (this.init) this.init(input)
}
Component.prototype = {
	constructor: Component,
	clone: function clone() {
		var sourceNode = this.node,
				targetNode = sourceNode.cloneNode(false)
		cloneChildren(targetNode, sourceNode.firstChild)
		return new Component(targetNode, this)
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
		var extra = mapEC.get(ptr)
		if (extra) {
			extra.update.apply(extra, arguments)
			ptr = (extra.footer || ptr).nextSibling
		}
		else ptr = ptr.nextSibling
	}
	return this
}
