var mapEC = require('./env').extra,
		cloneChildren = require('./util/clone-child')

module.exports = Component

/**
 * @constructor
 * @param {Object} node - DOM node
 * @param {Object} [extra] - configuration
 * @param {Object} [input] - init value
 */
function Component(node, extra, input) {
	this.update = updateChildren
	//decorate: key, init, update, onmove, handleEvents...
	if (extra) for (var i=0, ks=Object.keys(extra); i<ks.length; ++i) this[ks[i]] = extra[ks[i]]

	// register and init
	this.node = node
	mapEC.set(node, this)
	if (this.init) this.init(input)
}
Component.prototype = {
	constructor: Component,
	clone: function clone(input) {
		var sourceNode = this.node,
				targetNode = sourceNode.cloneNode(false)
<<<<<<< HEAD
		cloneChildren(targetNode, sourceNode.firstChild)
		return new Component(targetNode, cfg ? [this, cfg] : [this])
	},
	// to add event listeners binded to this context
	setEvent: function setEvent(name, handler) {
		this._eventHandlers[name] = handler
		this.node.addEventListener(name, this, componentEventOptions)
	},
	delEvent: function delEvent(name) {
		delete this._eventHandlers[name]
		this.node.removeEventListener(name, this, componentEventOptions)
	},
	// standard property called by window on event, binded to co
	handleEvent: function handleEvent(evt) {
		var fcn = this._eventHandlers[evt.type]
		evt.stopPropagation()
		fcn.call(this, evt)
=======
		cloneChildren(targetNode, sourceNode.firstChild, input)
		return new Component(targetNode, this, input)
>>>>>>> extra
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
