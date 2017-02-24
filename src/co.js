var creator = require('./util/creator'),
		element = require('./el/element'),
		ns = require('./util/namespaces'),
		store = require('./extra/store'),
		ctyp = require('./util/typ'),
		reduce = require('./util/reduce'),
		decorate = require('./util/decorate'),
		decorators = require('./extra/decorators')

var preset = creator(function(sel, cfg, cnt) {
	var elm = element(sel, cfg, cnt),
			ctx = new Component(elm, cfg)
	store(elm, ctx)
	return ctx
})

var co = preset()
co.svg = preset({xmlns: ns.svg})
co.preset = preset

module.exports = co

function Component(node, config) {
	this.node = node
	this._eventHandlers = {}
	decorate(this, config, decorators)
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
				if (ctyp(typ) === Object) reduce(typ, addListener, this)
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
		var oldParent = this.parentNode
		parent.insertBefore(this.node, before || null)
		if (this.onmove) this.onmove(oldParent, parent)
		return this.node
	},
	get textContent() { return this.node.textContent },
	set textContent(text) {
		var node = this.node
		if (node.testContent !== text) {
			var child = node.firstChild
			if (child && !child.nextSibling) child.nodeValue = text
			else node.textContent = text
		}
	}
}
function addListener(ctx, val, key) {
	ctx.on(key, val)
	return this
}
function updateChildren() {
	var ptr = this.node.firstChild
	while (ptr) {
		var extra = store(ptr)
		if (extra) {
			extra.ondata.apply(extra, arguments)
			ptr = (extra.footer || ptr).nextSibling
		}
		else ptr = ptr.nextSibling
	}
}
