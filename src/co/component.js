//TODO combine co and el. No lifecycle=> el, else=>co

var event = require('./event'),
		decorate = require('../util/decorate'),
		decorators = require('./decorators'),
		getChildItems = require('../util/get-child-items'),
		root = require('../util/root')

module.exports = Component

function Component(node, cfg, cnt) {
	this.node = node
	this._eventHandlers = {}
	getChildItems(cnt).forEach(function(itm) {
		itm.moveto ? itm.moveto(node) : node.appendChild(itm)
	})
	decorate(this, cfg, decorators)
	if (this.oninit) this.oninit(cfg)
	root.extra.set(node, this)
}
Component.prototype = {
	constructor: Component,
	on: event.listen,
	handleEvent: event.handleEvent,
	ondata: function ondata(a,b,c) {
		this.forEachExtra(function(extra) {
			extra.ondata(a,b,c)
		})
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
	},
	forEachExtra: function forEachExtra(fcn, ctx) {
		var ptr = this.node.firstChild,
				idx = 0
		while (ptr) {
			var extra = root.extra.get(ptr)
			fcn.call(ctx||null, extra, idx++)
			ptr = (extra.footer || ptr).nextSibling
		}
	}
}
