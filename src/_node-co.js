import {setThis} from './set-this'
import {picoKey} from './picoKey'
import {D} from './document'


/**
 * @constructor
 * @extends EventListener
 * @param {Node} node - DOM node
 */
export function NodeCo(node) {
	if (node[picoKey] || node.parentNode) throw Error('node already used')
	this.node = node
	// default updater: null || text || value
	if (node.nodeName === '#text') this.update = this.text
	if ('value' in node && node.nodeName !== 'LI') this.update = this.value

	node[picoKey] = this.update ? this : null
	//TODO destroy, ondestroy
}


export var ncProto = NodeCo.prototype = {
	constructor: NodeCo,
	root: null,

	// INSTANCE UTILITIES
	set: setThis,

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

	_childNode: function (node) {
		this.node.appendChild(node.cloneNode(true))
	},

	_childTemplate: function (template) {
		template.create(this).moveTo(this.node)
	},

	_childText: function appendText(txt) {
		this.node.appendChild(D.createTextNode(txt))
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
			return this
		}
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
		if (typeof type === 'object') for (var i=0, ks=Object.keys(type); i<ks.length; ++i) {
			this.registerHandler(ks[i], type[ks[i]])
		}
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
			if (co.update) co.update(v,k,o)
			child = (co.foot || child).nextSibling
		}
		else child = child.nextSibling
	}
}
