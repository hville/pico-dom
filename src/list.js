import {D} from './document'
import {picoKey} from './picoKey'
import {assignToThis} from './object'


/**
 * @constructor
 * @param {Object} model model
 */
export function List(model) {
	this._items = {}
	this.head = D.createComment('^')
	this.foot = D.createComment('$')
	this.assign(model)
	this.head[picoKey] = this.update ? this : null
}

List.prototype = {
	constructor: List,
	state: null,
	store: null,
	assign: assignToThis,

	/**
	* @function moveTo
	* @param  {Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		if (this.onmove) this.onmove(target)
		var foot = this.foot,
				next = this.head,
				origin = next.parentNode,
				target = parent.node || parent,
				cursor = before || null
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
	update: updateChildren,
	updateChildren: updateChildren,
	_placeItem: function(parent, item, spot) {
		return item.node ? insertChild(parent, item.node, spot)
		: item.head ? insertList(parent, item, spot).foot
		: insertChild(parent, item, spot)
	}
}

function updateChildren(v,k,o) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
			spot = this._updateChildren(v,k,o)

	while (spot !== foot) {
		var next = spot.nextSibling
		parent.removeChild(spot)
		spot = next
	}
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
