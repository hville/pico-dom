import {D} from './document'
import {picoKey} from './picoKey'
import {assignToThis} from './object'


/**
 * @constructor
 * @param {!Object} template
 * @param {Object} [options]
 */
export function List(template, options) {
	this._template = template
	this._items = {}
	this.head = D.createComment('^')
	this.foot = D.createComment('$')
	this.assign(options)
	this.head[picoKey] = this.update ? this : null
}

List.prototype = {
	constructor: List,
	common: null,
	assign: assignToThis,

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
	update: updateListChildren,
	updateChildren: updateListChildren,
	_placeItem: function(parent, item, spot) {
		return item.node ? insertChild(parent, item.node, spot)
		: item.head ? insertList(parent, item, spot).foot
		: insertChild(parent, item, spot)
	},
	_initChild: function(model, key) {
		return model.cloneNode ? model.cloneNode(true)
		: model.defaults({common: this.common, key: key}).create()
	}
}

function updateListChildren(v,k,o) {
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
