var decorate = require('../util/decorate'),
		decorators = require('../decorators'),
		ctyp = require('../util/ctyp'),
		reduce = require('../util/reduce'),
		mapEC = require('./mapec')

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
	mapEC(node, this)
	if (this.oninit) this.oninit(config)
}
Component.prototype = {
	constructor: Component,
	// to add event listeners binded to this context
	on: function on(typ, fcn) {
		var el = this.node,
				handlers = this._eventHandlers,
				options = {capture: true, passive:true}
		switch (arguments.length) {
			case 2:
				if (!fcn) {
					delete handlers[typ]
					el.removeEventListener(typ, this, options)
				}
				else {
					handlers[typ] = fcn
					el.addEventListener(typ, this, options)
				}
				break
			case 1:
				if (ctyp(typ, Object)) reduce(typ, addListener, this)
				else return handlers[typ]
		}
		return Object.keys(handlers)
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
		return this.node
	},
	moveto: function moveto(parent, before) {
		var node = this.node,
				oldParent = node.parentNode
		parent.insertBefore(node, before || null)
		if (this.onmove) this.onmove(oldParent, parent)
		return node
	},
	get textContent() { return this.node.textContent },
	set textContent(text) {
		var node = this.node,
				child = node.firstChild
		if (child && !child.nextSibling && child.nodeValue !== text) child.nodeValue = text
		else node.textContent = text
	}
}
function addListener(ctx, val, key) {
	ctx.on(key, val)
	return this
}
function updateChildren() {
	var ptr = this.node.firstChild
	while (ptr) {
		var extra = mapEC(ptr)
		if (extra) {
			extra.ondata.apply(extra, arguments)
			ptr = (extra.footer || ptr).nextSibling
		}
		else ptr = ptr.nextSibling
	}
}
