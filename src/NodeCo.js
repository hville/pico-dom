import {each, assignToThis} from './object'
import {initChild} from './initChild'
import {picoKey} from './picoKey'


/**
 * @constructor
 * @extends EventListener
 * @param {Node} node - DOM node
 * @param {Array} ops transforms
 */
export function NodeCo(node, ops) {
	this.node = node

	// default updater: null || text || value
	if (node.nodeName === '#text') this.update = this.text
	if ('value' in node) this.update = this.value //TODO fail on input.type = select

	for (var i=0; i<ops.length; ++i) {
		var op = ops[i]
		if (Array.isArray(op.arg)) op.fcn.apply(this, op.arg)
		else op.fcn.call(this, op.arg)
	}

	node[picoKey] = this.update ? this : null
}


export var ncProto = NodeCo.prototype = {
	constructor: NodeCo,
	state: null,
	store: null,
	// INSTANCE UTILITIES
	call: function(fcn) {
		fcn(this)
		return this
	},
	assign: assignToThis,
	// NODE SETTERS
	text: function(txt) {
		var first = this.node.firstChild
		if (first && !first.nextSibling) {
			if (first.nodeValue !== txt) first.nodeValue = txt
		}
		else this.node.textContent = txt
		return this
	},
	attr: function(key, val) {
		if (val === false) this.node.removeAttribute(key)
		else this.node.setAttribute(key, val === true ? '' : val)
		return this
	},
	prop: function(key, val) {
		if (this.node[key] !== val) this.node[key] = val
		return this
	},
	class: function(val) {
		this.node.setAttribute('class', val)
		return this
	},
	value: function(val) {
		if (this.node.value !== val) this.node.value = val
		return this
	},
	attrs: function(keyVals) {
		for (var i=0, ks=Object.keys(keyVals); i<ks.length; ++i) this.attr(ks[i], keyVals[ks[i]])
		return this
	},
	props: function(keyVals) {
		for (var i=0, ks=Object.keys(keyVals); i<ks.length; ++i) this.prop(ks[i], keyVals[ks[i]])
		return this
	},
	// PLACEMENT
	append: function() {
		for (var i=0; i<arguments.length; ++i) {
			var arg = arguments[i]
			if (Array.isArray(arg)) this.append.apply(this, arg)
			else {
				var child = initChild(arg, {
					store: this.store,
					state: this.state,
				})
				if (child.moveTo) child.moveTo(this.node)
				else if (child.nodeType) this.node.appendChild(child)
				else throw Error('wrond child type:' + typeof child)
			}
		}
		return this
	},
	moveTo: function(target, before) {
		if (this.onmove) this.onmove(target)
		;(target.node || target).insertBefore(this.node, before || null)
		return this
	},
	// UPDATE
	update: updateChildren,
	updateChildren: updateChildren,
	// EVENT LISTENERS
	handleEvent: function(event) {
		var handlers = this._on,
				handler = handlers && handlers[event.type]
		if (handler) handler.call(this, event)
	},
	on: function(type, handler) {
		if (typeof type === 'object') each(type, this.registerHandler, this)
		else this.registerHandler(handler, type)
		return this
	},
	registerHandler: function(handler, type) {
		if (!handler) {
			if (this._on && this._on[type]) {
				delete this._on[type]
				this.node.removeEventListener(type, this, false)
			}
		}
		else {
			if (!this._on) this._on = {}
			this._on[type] = handler
			this.node.addEventListener(type, this, false)
		}
	}
}

function updateChildren(v,k,o) {
	var child = this.node.firstChild
	while (child) {
		var co = child[picoKey]
		if (co) {
			co.update(v,k,o)
			child = (co.foot || child).nextSibling
		}
		else child = child.nextSibling
	}
}
