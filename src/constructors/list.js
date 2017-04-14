import {createComment} from '../create-comment'
import {setExtra, getExtra} from '../node-extra'

/**
 * @constructor
 * @param {Function} factory - component generating function
 * @param {*} dKey - data key
 */
export function List(factory, dKey) {
	if (dKey !== undefined) {
		this.dataKey = typeof dKey === 'function' ? dKey : function(v) { return v[dKey] }
	}

	// lookup maps to locate existing component and delete extra ones
	this.mapKC = new Map() // dataKey => component, for updating
	this.factory = factory

	//required to keep parent ref when no children.length === 0
	this.header = createComment('^')
	this.footer = createComment('$')
	setExtra(this.header, this)
	setExtra(this.footer, this)
}
List.prototype = {
	constructor: List,
	dataKey: function dataKey(v,i) { return i },
	update: updateChildren,
	updateChildren: updateChildren,

	/**
	* @function clone
	* @return {!List} new List
	*/
	clone: function clone() {
		return new List(this.factory, this.dataKey)
	},

	/**
	* @function moveTo
	* @param  {Object} parent parentNode
	* @param  {Object} [before] nextSibling
	* @return {!List} this
	*/
	moveTo: function moveTo(parent, before) {
		var foot = this.footer,
				head = this.header,
				oldParent = head.parentNode

		//nothing to do
		if (!oldParent && !parent) return this
		if ((oldParent === parent) && (before === foot || before === foot.nextSibling)) return this

		// list without parent are empty, just move the ends
		if (!oldParent) {
			parent.appendChild(head)
			parent.appendChild(foot)
			return this
		}

		// clear the list if dismounted (newParent === null)
		if (!parent) {
			this.removeChildren()
			oldParent.removeChild(head)
			oldParent.removeChild(foot)
			return this
		}

		// insert || append
		var next = head.nextSibling
		if (!before) before = null

		parent.insertBefore(head, before)
		while(next !== foot) {
			var item = next
			next = item.nextSibling

			var ctx = getExtra(item)
			if (ctx) ctx.moveTo(parent, before)
			else parent.insertBefore(item, before)
		}
		parent.insertBefore(foot, before)

		return this
	},

	/**
	* @function removeChildren
	* @param  {Object} [after] optional Element pointer
	* @return {!List} list instance
	*/
	removeChildren: function removeChildren(after) {
		var foot = this.footer,
				parent = foot.parentNode
		// list without parent are empty
		if (!parent) return this

		var mapKC = this.mapKC,
				stop = after || this.header,
				drop = foot

		while ((drop = foot.previousSibling) !== stop) {
			var extra = getExtra(drop)
			mapKC.delete(extra.key)
			extra.moveTo(null)
		}
		return this
	}
}

/**
* @function updateChildren
* @param  {Array} arr array of values to update
* @param  {...*} optional update arguments
* @return {!List} list instance
*/
function updateChildren(arr) {
	var head = this.header,
			foot = this.footer,
			parent = head.parentNode
	if (!parent) throw Error('list.updates requires a parentNode')
	var mapKC = this.mapKC,
			getK = this.dataKey,
			before = head.nextSibling

	for (var i=0; i<arr.length; ++i) {
		var val = arr[i],
				key = getK(val, i, arr)
		// find item, create Item if it does not exits
		var itm = mapKC.get(key)
		if (!itm) {
			itm = this.factory(key, i)
			if (itm.key !== key) itm.key = key
			mapKC.set(key, itm)
			parent.insertBefore(itm.node, before) // new item: insertion
		}
		else if (itm.node === before) { // right position, move on
			before = itm.node.nextSibling
		}
		else if (itm.node === before.nextSibling) { // likely deletion, possible reshuffle. move to end
			parent.insertBefore(before, foot)
			before = itm.node.nextSibling
		}
		else {
			parent.insertBefore(itm.node, before) //move existing node back
		}
		if (itm.update) itm.update(val, i, arr)
	}

	// de-reference leftover items
	return this.removeChildren(before.previousSibling)
}
