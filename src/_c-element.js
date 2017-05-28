import {D} from './document'
import {picoKey} from './picoKey'

/**
 * @constructor
 * @param {Element} node - DOM node
 */
export function CElement(node) {
	this.root = null
	this.node = node
	this.update = this.updateChildren
	node[picoKey] = this
}

export var CElementProto = CElement.prototype = {
	constructor: CElement,

	/**
	* @function
	* @param  {!Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var node = this.node,
				anchor = before || null
		if (!parent) throw Error('invalid parent node')

		if (node.parentNode !== parent || (anchor !== node && anchor !== node.nextSibling)) {
			parent.insertBefore(node, anchor)
		}
		return this
	},

	/**
	* @function
	* @return {!Object} this
	*/
	remove: function() {
		var node = this.node,
				origin = node.parentNode
		if (origin) origin.removeChild(node)
		return this
	},

	destroy: function() {
		this.remove()
		if (this._events) for (var i=0, ks=Object.keys(this._events); i<ks.length; ++i) this.event(ks[i], false)
		return this
	},

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

	prop: function(key, val) {
		if (this.node[key] !== val) this.node[key] = val
		return this
	},

	text: function(txt) {
		this.node.textContent = txt
		return this
	},

	attr: function(key, val) {
		if (val === false) this.node.removeAttribute(key)
		else this.node.setAttribute(key, val === true ? '' : val)
		return this
	},

	class: function(val) {
		this.node.setAttribute('class', val)
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

	// EVENT LISTENERS
	handleEvent: function(event) {
		var handlers = this._events,
				handler = handlers && handlers[event.type]
		if (handler) handler.call(this, event)
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
	},

	updateChildren: function updateChildren(v,k,o) {
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
}
