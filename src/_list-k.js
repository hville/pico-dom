import {D} from './document'
import {picoKey} from './picoKey'
import {assignToThis} from './object'

/**
 * @constructor
 * @param {!Object} template
 * @param {Object} [options]
 */
export function ListK(template) {
	this._init(template)
}

ListK.prototype = {
	constructor: ListK,
	common: null,
	assign: assignToThis,

	_init: function(template) {
		this._template = template //TODO delete
		this._items = {} //TODO common refs
		this.node = D.createComment('^')
		this.foot = D.createComment('$') //TODO dynamic
		this.node[picoKey] = this.update ? this : null
	},

	/**
	* @function moveTo
	* @param  {Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var foot = this.foot,
				next = this.node,
				origin = next.parentNode,
				target = parent.node || parent,
				cursor = before || null
		if (next.parentNode !== foot.parentNode) throw Error('list moveTo parent mismatch')
		if (this.onmove) this.onmove(origin, target)
		// skip case where there is nothing to do
		if (cursor === foot || (origin === target && cursor === foot.nextSibling)) return this

		if (origin) {
			if (target) { // relocate
				do next = (cursor = next).nextSibling
				while (target.insertBefore(cursor, before) !== foot)
			}
			else { // remove all
				do next = (cursor = next).nextSibling
				while (origin.removeChild(cursor) !== foot)
			}
		}
		else if (target) { //head and foot only
			target.insertBefore(next, before)
			target.insertBefore(foot, before)
		}

		return this
	},

	getKey: function(v,k) { return k }, // default: indexed

	update: updateKeyedChildren,

	updateChildren: updateKeyedChildren,

	_childTemplate: function (template) {
		this._template = template //TODO reset or disallow if already set
		return this
	},

	_placeItem: function(parent, item, spot) {
		if (item.foot) {
			if (!spot) return item.moveTo(parent)
			var head = item.node
			if (head === spot.nextSibling) parent.removeChild(spot) // later cleared or re-inserted
			else if (head !== spot) item.moveTo(parent, spot)
			return item.foot
		}
		var node = item.node || item //TODO Component Only with lifecycle
		if (!spot) parent.appendChild(node)
		else if (node === spot.nextSibling) parent.removeChild(spot) // later cleared or re-inserted
		else if (node !== spot) parent.insertBefore(node, spot)
		return node
	}
}


function updateKeyedChildren(arr) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
			spot = this.node.nextSibling,
			items = this._items,
			newM = Object.create(null)
	if (this.node.parentNode !== foot.parentNode) throw Error('keyedlist update parent mismatch')

	for (var i=0; i<arr.length; ++i) {
		var key = this.getKey(arr[i], i, arr),
				model = this._template,
				item = newM[key] = items[key] || model.create({common: this.common, key: key})

		if (item) {
			if (item.update) item.update(arr[i], i, arr)
			spot = this._placeItem(parent, item, spot).nextSibling
		}
	}

	this._items = newM

	if (spot !== foot) while (spot !== parent.removeChild(foot.previousSibling)) {} //eslint-disable-line no-empty
	return this
}
