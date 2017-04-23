import {createComment} from './create-node'
import {extras} from './extras'
import {setChildren} from './set-children'
import {updateNode} from './update-node'
import {cloneNode} from './clone-node'

/**
* @function createList
* @param  {List|Node|Function} model list or component factory or instance to be cloned
* @param  {Function|string|number} [dataKey] record identifier
* @return {!List} new List
*/
export function createList(model, dataKey) {
	return new List(
		typeof model === 'function' ? model : function() { return cloneNode(model, true) },
		dataKey
	)
}

/**
 * @constructor
 * @param {Function} factory - component generating function
 * @param {*} dKey - data key
 */
export function List(factory, dKey) {
	if (dKey !== undefined) {
		this.dataKey = typeof dKey === 'function' ? dKey : function(v) { return v[dKey] }
	}
	this.data = []
	// lookup maps to locate existing component and delete extra ones
	this.mapKN = {} // dataKey => component, for updating
	this.factory = factory

	//required to keep parent ref when no children.length === 0
	this.head = createComment('^')
	this.foot = createComment('$')
	extras.set(this.head, this)
	extras.set(this.foot, this)
}
List.prototype = {
	constructor: List,
	dataKey: function dataKey(v,i) { return i },

	forEach: function forEach(fcn, ctx) {
		var data = this.data

		fcn.call(ctx, this.head)
		for (var i=0; i<data.length; ++i) {
			var key = this.dataKey(data[i], i, data)
			fcn.call(ctx, this.mapKN[key], key)
		}
		fcn.call(ctx, this.foot)
	},

	/**
	* @function clone
	* @return {!List} new List
	*/
	clone: function clone() {
		return new List(this.factory, this.dataKey).foot
	},

	/**
	* @function moveTo
	* @param  {Object} head node to be moved
	* @param  {Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!List} this
	*/
	moveTo: function moveTo(head, parent, before) {
		var foot = this.foot,
				origin = head.parentNode
		// skip case where there is nothing to do
		if ((origin || parent) && before !== foot && (origin !== parent || before !== foot.nextSibling)) {
			// newParent == null -> remove only
			if (!parent) setChildren(origin, null, head.previousSibling, foot.nextSibling)
			else setChildren(parent, this, before || parent.lastChild, before)
		}
		return foot
	},

	update: function update(head, arr) {
		var oldKN = this.mapKN,
				newKN = this.mapKN = {},
				getK = this.dataKey
		//TODO simplify index keys

		// update the node keyed map
		this.data = arr
		for (var i=0; i<arr.length; ++i) {
			var val = arr[i],
					key = getK(val, i, arr)
			// find item, create Item if it does not exits
			var node = newKN[key] = oldKN[key] || this.factory(key, i)
			updateNode(node, val, i, arr)
		}

		// update the view
		var foot = this.foot,
				parent = head.parentNode
		if (!parent) return this //TODO check return value|type
		setChildren(parent, this, head && head.previousSibling, foot && foot.nextSibling)

		return foot
	}
}
