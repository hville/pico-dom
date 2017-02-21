var event = require('./event'),
		decorate = require('../util/decorate'),
		decorators = require('./decorators'),
		Fragment = require('./fragment')

module.exports = Component

function Component(node, cfg, cnt) {
	this.node = node
	this._eventHandlers = {}
	// children
	if (cnt) {
		this.children = new Fragment(cnt)
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
	}/*,
	forEachChild: function forEachChild(fcn, ctx) {
		var childNodes = this.node.childNodes
		for (var i=0; i<childNodes; ++i) fcn.call(ctx||null, childNodes.item(i), i, childNodes)
	}*/
}
