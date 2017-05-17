import {D} from './document'
import {picoKey} from './picoKey'
import {assignToThis} from './object'

/**
 * @constructor
 * @param {!Object} template
 * @param {Object} [options]
 */
export function ListK(template, options) {
	this._init(template, options)
}

ListK.prototype = {
	constructor: ListK,
	common: null,
	assign: assignToThis,

	_init: function(template, options) {
		this._template = template
		this._items = {}
		this.head = D.createComment('^')
		this.foot = D.createComment('$')
		this.assign(options)
		this.head[picoKey] = this.update ? this : null
	},

	/**
	* @function moveTo
	* @param  {Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var foot = this.foot,
				next = this.head,
				origin = next.parentNode,
				target = parent.node || parent,
				cursor = before || null
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

	_placeItem: function(parent, item, spot) {
		return item.node ? insertChild(parent, item.node, spot)
		: item.head ? insertList(parent, item, spot).foot
		: insertChild(parent, item, spot)
	}
}

function updateKeyedChildren(arr) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
			spot = this.head.nextSibling,
			items = this._items,
			newM = {}

	for (var i=0; i<arr.length; ++i) {
		var key = this.getKey(arr[i], i, arr),
				model = this._template,
				item = newM[key] = items[key] || (model.cloneNode ? model.cloneNode(true)
					: model.defaults({common: this.common, key: key}).create())

		if (item) {
			if (item.update) item.update(arr[i], i, arr)
			spot = this._placeItem(parent, item, spot).nextSibling
		}
	}

	this._items = newM

	if (spot !== foot) while (spot !== parent.removeChild(foot.previousSibling)) {} //eslint-disable-line no-empty
	return this
}


function insertChild(parent, node, spot) {
	if (!spot) parent.appendChild(node)
	else if (node === spot.nextSibling) parent.removeChild(spot) // later cleared or re-inserted
	else if (node !== spot) parent.insertBefore(node, spot)
	return node
}


function insertList(parent, list, spot) {
	if (!spot) return list.moveTo(parent)
	var head = list.head
	if (head === spot.nextSibling) parent.removeChild(spot) // later cleared or re-inserted
	else if (head !== spot) list.moveTo(parent, spot)
	return list
}
