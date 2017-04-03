var reduce = require('./util/reduce'),
		mapEC = require('./env').extra,
		cloneChildren = require('./util/clone-child')

var componentEventOptions = {capture: true, passive:true}

module.exports = Component

/**
 * @constructor
 * @param {Object} node - DOM node
 * @param {Object} [configs] - configuration
 */
function Component(node, configs) {
	this.node = node
	this._eventHandlers = {}
	this.update = updateChildren

	// decorate
	if (configs) for (var i=0; i<configs.length; ++i) {
		var cfg = configs[i]
		if (cfg.key) this.key = cfg.key
		if (cfg.init) this.init = cfg.init
		if (cfg.update) this.update = cfg.update
		if (cfg.onmove) this.onmove = cfg.onmove
		if (cfg.on) addEventListeners(this, cfg.on)
		if (cfg._eventHandlers) addEventListeners(this, cfg._eventHandlers) //for cloning self
	}
	// register and init
	mapEC.set(node, this)
	if (this.init) this.init()
}
Component.prototype = {
	constructor: Component,
	clone: function clone(cfg) {
		var sourceNode = this.node,
				targetNode = sourceNode.cloneNode(false),
				cloneCo = new Component(targetNode, cfg ? [this, cfg] : [this])
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
function addEventListeners(ctx, obj) {
	reduce(obj, setEvt, ctx)
	return ctx
}
function setEvt(ctx, fcn, key) {
	ctx.setEvent(key, fcn)
	return ctx
}
