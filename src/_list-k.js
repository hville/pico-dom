import {D} from './document'
import {picoKey} from './picoKey'
import {setThis} from './set-this'

/**
 * @constructor
 * @param {!Object} template
 */
export function ListK(template) {
	this.template = template
	this.refs = {}
	this.node = D.createComment('^')
	this.foot = D.createComment('$')
	this.node[picoKey] = this
}

ListK.prototype = {
	constructor: ListK,
	root: null,
	set: setThis,

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
			if (this.onmove) this.onmove(origin, parent)

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
				origin = head.parentNode

		if (origin) {
			if (this.onmove) this.onmove(origin, null)
			this._clearFrom(head.nextSibling)
			origin.removeChild(this.foot)
			origin.removeChild(head)
		}

		return this
	},

	getKey: function(v,k) { return k }, // default: indexed

	update: updateKeyedChildren,

	updateChildren: updateKeyedChildren,


	_placeItem: function(parent, item, spot, foot) {
		if (!spot) item.moveTo(parent)
		else if (item.node === spot.nextSibling) spot[picoKey].moveTo(parent, foot)
		else if (item.node !== spot) item.moveTo(parent, spot)
		return item.foot || item.node
	},

	_clearFrom: function(spot) {
		while(spot !== this.foot) {
			var item = spot[picoKey]
			spot = (item.foot || item.node).nextSibling
			item.remove()
		}
	}
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
	this._clearFrom(spot)
	return this
}
