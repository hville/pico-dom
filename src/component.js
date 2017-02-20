var event = require('./co/event')

module.exports = Component

function Component(node, cfg, fragment) {
	this.node = node
	this._eventHandlers = {}
	// children
	if (fragment) {
		this.children = fragment
		this.children.moveto(node)
	}
	if (cfg) {
		if (cfg.on) this.on(cfg.on)
		// lifecycle hooks
		if (cfg.ondata) this.ondata = cfg.ondata
		if (cfg.onmove) this.onmove = cfg.onmove
		if (cfg.oninit) {
			this.oninit = cfg.oninit
			this.oninit(cfg)
		}
	}
}
Component.prototype = {
	constructor: Component,
	oninit: null,
	children: null,
	on: event.listen,
	handleEvent: event.handleEvent,
	ondata: function ondata() {
		var children = this.children
		children.ondata.apply(children, arguments) //default pass-through
	},
	view: function() {
		this.ondata.apply(this, arguments)
		return this.node
	},
	moveto: function moveto(parent, before) {
		var oldParent = this.parentNode
		parent.insertBefore(this.node, before || null)
		if (this.onmove) this.onmove(oldParent, parent)
		return this.node
	}
}
