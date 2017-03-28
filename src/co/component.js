var decorate = require('../util/decorate'),
		decorators = require('./decorators'),
		mapEC = require('../env').extra,
		cloneChildren = require('../util/clone-child')

var componentEventOptions = {capture: true, passive:true}

module.exports = Component

/**
 * @constructor
 * @param {Object} node - DOM node
 * @param {Object} [config] - configuration
 */
function Component(node, config) {
	this.node = node
	this._eventHandlers = {}
	decorate(this, config, decorators)
	mapEC.set(node, this)
	if (this.oninit) this.oninit(config)
}
Component.prototype = {
	constructor: Component,
	clone: function clone() {
		var sourceNode = this.node,
				targetNode = sourceNode.cloneNode(false),
				cloneCo = new Component(targetNode, this)
		cloneChildren(targetNode, sourceNode.firstChild)
		mapEC.set(targetNode, cloneCo)
		return cloneCo
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
	},
	ondata: updateChildren,
	updateChildren: updateChildren,
	update: function() {
		this.ondata.apply(this, arguments)
		return this
	},
	moveto: function moveto(parent, before) {
		var node = this.node,
				oldParent = node.parentNode
		parent.insertBefore(node, before || null)
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
}
