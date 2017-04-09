import Component from './component'
import {comment} from './nodes'
import EXTRA from './extra'

function createFactory(instance) {
	return function(k, i) {
		var comp = instance.clone(k, i)
		return comp
	}
}

export default function list(model, dataKey) {
	switch (model.constructor) {
		case Function:
			return new List(model, dataKey)
		case Component: case List:
			return new List(createFactory(model), dataKey)
		default:
			throw Error('invalid list model:' + typeof model)
	}
}

/**
 * @constructor
 * @param {Function} factory - component generating function
 * @param {*} dKey - data key
 */
function List(factory, dKey) {
	this.dataKey = !dKey ? getIndex
		: typeof dKey === 'function' ? dKey
		: function(v) { return v[dKey] }

	// lookup maps to locate existing component and delete extra ones
	this.mapKC = new Map() // dataKey => component, for updating
	this.factory = factory

	//required to keep parent ref when no children.length === 0
	this.header = comment('^')
	this.footer = comment('$')
	EXTRA.set(this.header, this)
	EXTRA.set(this.footer, this)
}
List.prototype = {
	constructor: List,
	clone: function clone() {
		return new List(this.factory, this.dataKey)
	},
	/**
	* @function moveto
	* @param  {Object} parent parentNode
	* @param  {Object} [before] nextSibling
	* @return {Object} header
	*/
	moveto: function moveto(parent, before) {
		var foot = this.footer,
				head = this.header
		// clear the list if no parent
		if (!parent) {
			this.clear()
			var oldParent = head.parentNode
			if (oldParent) {
				oldParent.removeChild(head)
				oldParent.removeChild(foot)
			}
			return this
		}
		// list without parent are empty
		if (!head.parentNode) {
			parent.appendChild(head)
			parent.appendChild(foot)
			return head
		}
		// insert from footer to header to avoid repaint if all in right place
		var next = foot.previousSibling
		if (foot !== before) before = parent.insertBefore(foot, before||null)
		while (next !== head) {
			var item = next
			next = item.previousSibling
			var ctx = EXTRA.get(item)
			if (ctx) before = ctx.moveto(parent, before)
		}
		if (head !== before) before = parent.insertBefore(head, before)
		return before //last insertedChild || first fragmentElement
	},
	update: function update(arr) {
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
		return this.clear(before.previousSibling)
	},
	/**
	* @function clear
	* @param  {Object} [after] optional Element pointer
	* @return {Object} list instance
	*/
	clear: function clear(after) {
		var foot = this.footer,
				parent = foot.parentNode
		// list without parent are empty
		if (!parent) return this

		var mapKC = this.mapKC,
				stop = after || this.header,
				drop = foot

		while ((drop = foot.previousSibling) !== stop) {
			var extra = EXTRA.get(drop)
			mapKC.delete(extra.key)
			extra.moveto(null)
		}
		return this
	}
}
function getIndex(v,i) {
	return i
}
