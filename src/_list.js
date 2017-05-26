import {D} from './document'
import {picoKey} from './picoKey'
import {extraProto} from './_extra'


/**
 * @constructor
 * @param {!Object} template
 */
export function List(template) {
	this.template = template
	this.refs = {}
	this.node = D.createComment('^')
	this.foot = D.createComment('$')
	this.node[picoKey] = this

	if (!template.create) { // select list
		this.update = this.updateChildren = updateSelectChildren
		for (var i=0, ks=Object.keys(template); i<ks.length; ++i) {
			var key = ks[i]
			this.refs[key] = template[key].create(this, key)
		}
	}
}

List.prototype = {
	constructor: List,

	extra: extraProto.extra,

	/**
	* @function moveTo
	* @param  {!Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var foot = this.foot,
				next = this.node,
				origin = next.parentNode,
				anchor = before || null

		if (!parent) throw Error('invalid parent node')

		if (origin !== parent || (anchor !== foot && anchor !== foot.nextSibling)) {

			if (origin) { // relocate
				var cursor
				do next = (cursor = next).nextSibling
				while (parent.insertBefore(cursor, anchor) !== foot)
			}
			else { // insertion
				parent.insertBefore(next, anchor)
				parent.insertBefore(foot, anchor)
			}
		}
		return this
	},


	/**
	* @function remove
	* @return {!Object} this
	*/
	remove: function() {
		var head = this.node,
				origin = head.parentNode,
				spot = head.nextSibling

		if (origin) {
			while(spot !== this.foot) {
				var item = spot[picoKey]
				spot = (item.foot || item.node).nextSibling
				item.remove()
			}
			origin.removeChild(this.foot)
			origin.removeChild(head)
		}

		return this
	},

	destroy: extraProto.destroy,

	update: updateKeyedChildren,

	updateChildren: updateKeyedChildren,

	_placeItem: function(parent, item, spot, foot) {
		if (!spot) item.moveTo(parent)
		else if (item.node === spot.nextSibling) spot[picoKey].moveTo(parent, foot)
		else if (item.node !== spot) item.moveTo(parent, spot)
		return item.foot || item.node
	},

	// FOR KEYED LIST

	getKey: function(v,k) { return k }, // default: indexed

	// FOR SELECT LIST

	/**
	 * select all by default
	 * @function
	 * @param {...*} [v]
	 * @return {!Array}
	 */
	select: function(v) { return Object.keys(this.refs) }, //eslint-disable-line no-unused-vars

}


function updateKeyedChildren(arr) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
			spot = this.node.nextSibling,
			items = this.refs,
			newM = Object.create(null)
	if (this.node.parentNode !== foot.parentNode) throw Error('keyedlist update parent mismatch')

	for (var i=0; i<arr.length; ++i) {
		var key = this.getKey(arr[i], i, arr),
				model = this.template,
				item = newM[key] = items[key] || model.create(this, key)

		if (item) {
			if (item.update) item.update(arr[i], i, arr)
			spot = this._placeItem(parent, item, spot, foot).nextSibling
		}
	}

	this.refs = newM
	while(spot !== this.foot) {
		item = spot[picoKey]
		spot = (item.foot || item.node).nextSibling
		item.destroy()
	}
	return this
}

function updateSelectChildren(v,k,o) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
			spot = this.node.nextSibling,
			items = this.refs,
			keys = this.select(v,k,o)
	if (this.node.parentNode !== foot.parentNode) throw Error('selectlist update parent mismatch')

	for (var i=0; i<keys.length; ++i) {
		var item = items[keys[i]]
		if (item) {
			if (item.update) item.update(v,k,o)
			spot = this._placeItem(parent, item, spot, foot).nextSibling
		}
	}
	while(spot !== this.foot) {
		item = spot[picoKey]
		spot = (item.foot || item.node).nextSibling
		item.remove()
	}
	return this
}
