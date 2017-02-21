var event = require('./event'),
		decorate = require('../util/decorate'),
		decorators = require('./decorators')

module.exports = Component

function Component(node, cfg, fragment) {
	this.node = node
	this._eventHandlers = {}
	// children
	if (fragment) {
		this.children = fragment
		this.children.moveto(node)
	}
	decorate(this, cfg, decorators)
	if (this.oninit) this.oninit(cfg)
}
Component.prototype = {
	constructor: Component,
	on: event.listen,
	handleEvent: event.handleEvent,
	ondata: function ondata(a,b,c) {
		this.children.forEach(function(child) { if (child.ondata) child.ondata(a,b,c) })
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
