import {picoKey} from './picoKey'
import {D} from './document'


/**
 * @constructor
 * @extends EventListener
 * @param {Node} node - DOM node
 */
export function Extra(node) {
	if (node[picoKey] || node.parentNode) throw Error('node already used')
	this.node = node

	// default updater: null || text || value
	if (node.nodeName === '#text') this.update = this.text
	if ('value' in node && node.nodeName !== 'LI') this.update = this.value

	node[picoKey] = this
}


export var extraProto = Extra.prototype = {
	constructor: Extra,
	root: null,
	_events: null,
	oninsert: null, //TODO
	onmove: null, //TODO
	onremove: null,
	ondestroy: null,

	// INSTANCE UTILITIES
	/**
	 * @function
	 * @param {string|number} key
	 * @param {*} val value
	 * @returns {!Object} this
	 */
	extra: function(key, val) {
		this[key] = val
		return this
	},

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
	append: function() {
		var node = this.node
		for (var i=0; i<arguments.length; ++i) {
			var child = arguments[i]
			if (child != null) {
				if (Array.isArray(child)) this.append.apply(this, child)
				else if (child.create) child.create(this).moveTo(node)
				else if (child.moveTo) child.moveTo(node)
				else node.appendChild(
					child.cloneNode ? child.cloneNode(true) : D.createTextNode(''+child)
				)
			}
		}
		return this
	},


	// PLACEMENT

	/**
	* @function
	* @return {!Object} this
	*/
	remove: function() {
		var node = this.node,
				origin = node.parentNode
		if (origin) {
			if (this.onremove && this.onremove()) return this
			if (this.onmove) this.onmove(origin, null)
			origin.removeChild(node)
		}
		return this
	},

	/**
	* @function
	* @param  {!Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var node = this.node,
				origin = node.parentNode,
				anchor = before || null
		if (!parent) throw Error('invalid parent node')

		if (origin !== parent || (anchor !== node && anchor !== node.nextSibling)) {
			if (this.onmove) this.onmove(this.node.parentNode, parent)
			parent.insertBefore(node, anchor)
		}
		return this
	},

	destroy: function() {
		if (this.ondestroy && this.ondestroy()) return this
		this.remove()
		if (this._events) for (var i=0, ks=Object.keys(this._events); i<ks.length; ++i) this.event(ks[i])
		this.node = this.refs = null
	},

	// UPDATE
	update: updateChildren,
	updateChildren: updateChildren,
	// EVENT LISTENERS
	handleEvent: function(event) {
		var handlers = this._events,
				handler = handlers && handlers[event.type]
		if (handler) handler.call(this, event)
	},
	events: function(handlers) {
		for (var i=0, ks=Object.keys(handlers); i<ks.length; ++i) this.event(ks[i], handlers[ks[i]])
		return this
	},
	event: function(type, handler) {
		if (!handler) {
			if (this._events && this._events[type]) {
				delete this._events[type]
				this.node.removeEventListener(type, this, false)
			}
		}
		else {
			if (!this._events) this._events = {}
			this._events[type] = handler
			this.node.addEventListener(type, this, false)
		}
	}
}

function updateChildren(v,k,o) {
	var child = this.node.firstChild
	while (child) {
		var co = child[picoKey]
		if (co) {
			if (co.update) co.update(v,k,o)
			child = (co.foot || child).nextSibling
		}
		else child = child.nextSibling
	}
	return this
}
