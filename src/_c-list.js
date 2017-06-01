import {D} from './document'
import {picoKey} from './picoKey'
import {CElementProto} from './_c-element'


/**
 * @constructor
 * @param {!Object} template
 */
export function CList(template) {
	this.root = null
	this.template = template
	this.node = D.createComment('^')
	this.foot = D.createComment('$')
	this.refs = Object.create(null)
	this.node[picoKey] = this
	this.foot[picoKey] = this

	//keyed
	if (template.create) this.update = this.updateChildren
	// select list
	else {
		this.update = this.updateChildren = updateSelectChildren
		for (var i=0, ks=Object.keys(template); i<ks.length; ++i) {
			var key = ks[i]
			this.refs[key] = template[key].create(this, key)
		}
	}
}

CList.prototype = {
	constructor: CList,
	extra: CElementProto.extra,
	prop: CElementProto.prop,
	remove: remove,
	destroy: remove,


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

		if (!parent.nodeType) throw Error('invalid parent node')

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

	_placeItem: function(parent, item, spot, foot) {
		if (!spot) item.moveTo(parent)
		else if (item.node === spot.nextSibling) spot[picoKey].moveTo(parent, foot)
		else if (item.node !== spot) item.moveTo(parent, spot)
		return item.foot || item.node
	},

	// FOR KEYED LIST
	getKey: function(v,i,a) { //eslint-disable-line no-unused-vars
		return i  // default: indexed
	},

	updateChildren: function updateKeyedChildren(arr) {
		var foot = this.foot,
				parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
				spot = this.node.nextSibling,
				items = this.refs,
				refs = Object.create(null)

		for (var i=0; i<arr.length; ++i) {
			var key = this.getKey(arr[i], i, arr),
<<<<<<< HEAD
					item = items[key] || (items[key] = this.template.create(this, key))
=======
					item = refs[key] = items[key] || this.template.create(this, key)
>>>>>>> 0c171f02415ec8ee8a219ea5e156b50c8e84d06c
			if (item.update) item.update(arr[i], i, arr)
			spot = this._placeItem(parent, item, spot, foot).nextSibling
		}
		this.refs = refs

		if (spot !== foot) do {
			item = foot.previousSibling[picoKey]
			item.destroy()
		} while (item !== spot[picoKey])

		return this
	},

	// FOR SELECT LIST
	/**
	 * select all by default
	 * @function
	 * @param {...*} [v]
	 * @return {!Array}
	 */
	select: function(v) { return Object.keys(this.refs) } //eslint-disable-line no-unused-vars
}


function updateSelectChildren(v,k,o) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
			spot = this.node.nextSibling,
			items = this.refs,
			keys = this.select(v,k,o)

	for (var i=0; i<keys.length; ++i) {
		var item = items[keys[i]]
		if (item) {
			if (item.update) item.update(v,k,o)
			spot = this._placeItem(parent, item, spot, foot).nextSibling
		}
	}
	if (spot !== foot) do {
		item = foot.previousSibling[picoKey]
		item.destroy()
	} while (item !== spot[picoKey])
	return this
}

/**
* @function remove
* @return {!Object} this
*/
function remove() {
	var head = this.node,
			origin = head.parentNode,
			spot = head.nextSibling

	if (origin) {
		if (spot !== this.foot) do {
			var item = this.foot.previousSibling[picoKey]
			item.destroy()
		} while (item !== spot[picoKey])
		origin.removeChild(this.foot)
		origin.removeChild(head)
	}

	return this
}
