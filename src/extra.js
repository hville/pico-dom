import {extras} from './extras'
import {assign} from './util/reduce'
import {cloneChildren} from './clone-node'
import {Getter} from './getter'
import {createTextNode} from './create-node'
import {List} from './list'
import {updateChildren} from './children'

/**
 * @constructor
 * @param {Object} node - DOM node
 * @param {Object} [extra] - configuration
 * @param {*} [key] - optional data key
 * @param {number} [idx] - optional position index
 */
export function Extra(node, extra) {
	if (extra) assign(this, extra)
	this.node = node
	extras.set(node, this)
	//TODO init
}

Extra.prototype = {
	constructor: Extra,
	patch: null,
	init: null, //TODO
/*	get nextSibling() { //TODO delete
		return this.node.nextSibling
	},*/
	clone: function(deep) {
		var copy = this.node.cloneNode(false)
		// copy tree before creating initiating the new Extra
		if (deep !== false) cloneChildren(this.node, copy)
		return new Extra(copy, this)
	},
	updateChildren: function(v,k,o) {
		updateChildren(this.node, v,k,o)
		return this
	},
	update: updateSelf,
	updateSelf: updateSelf,
	moveTo: function(parent, before) {
		var node = this.node,
				oldParent = node.parentNode
		if (parent) extras.node(parent).insertBefore(node, before || null) //TODO getNode
		else if (oldParent) oldParent.removeChild(node)
		if (this.onmove) this.onmove(oldParent, parent)
		return this
	},
	addPatch: function(patch) {
		var extra = this
		if (!extra.patch) extra.patch = [patch]
		else extra.patch.push(patch)
		return this
	},
	setProp: function(key, val) {
		// dynamic patch if value is a getter
		if (val instanceof Getter) return this.addPatch(function(v,k,o) {
			return this.setProp(key, val.get(v,k,o))
		})

		if (this.node[key] !== val) this.node[key] = val
		return this
	},
	setText: function(txt) {
		// dynamic patch if value is a getter
		if (txt instanceof Getter) return this.addPatch(function(v,k,o) {
			return this.setText(txt.get(v,k,o))
		})

		var child = this.node.firstChild
		if (child && !child.nextSibling) {
			if (child.nodeValue !== txt) child.nodeValue = txt
		}
		else this.node.textContent = txt
		return this
	},
	setAttr: function(key, val) {
		// dynamic patch if value is a getter
		if (val instanceof Getter) return this.addPatch(function(v,k,o) {
			return this.setAttr(key, val.get(v,k,o))
		})

		if (val === false) this.node.removeAttribute(key)
		else this.node.setAttribute(key, val === true ? '' : val)
		return this
	},
	addChild: function(child) {
		/*	if (child instanceof Getter) {

		//TODO
		A: fragment with nodes getter/setter: nodes = [newNodes] || fragment.replace()
		B: list with factory (k?v,i) ?

				return this.addPatch(function(v,k,o) {
				return this.setAttr(key, val.get(v,k,o))
			})
			}
		*/
		if (child instanceof Getter) throw Error('childLens not supported')
		switch(child == null ? child : child.constructor || Object) { //eslint-disable-line eqeqeq
			case null: case undefined:
				return this
			case Array:
				for (var i=0; i<child.length; ++i) this.addChild(child[i])
				return this
			case Number:
				this.addChild(createTextNode(''+child))
				return this
			case String:
				this.addChild(createTextNode(child))
				return this
			case Extra: case List:
				child.moveTo(this.node)
				return this
			default:
				if (child.nodeType) this.node.appendChild(child)
				else throw Error ('unsupported child type ' + typeof child)
				return this
		}
	}
}

function updateSelf(v,k,o) {
	if (this.patch) for (var i=0; i<this.patch.length; ++i) this.patch[i].call(this, v,k,o)
	return this
}
