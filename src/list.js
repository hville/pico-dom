import {createComment} from './create-node'
import {extras} from './extras'
import {setChildren} from './set-children'
import {update} from './update'
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
	).foot
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
	this.data = [] //???
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
	dataKey: function(v,i) { return i },

	forEach: function(fcn, ctx) {
		var data = this.data //TODO???
		for (var i=0; i<data.length; ++i) {
			var key = this.dataKey(data[i], i, data)
			fcn.call(ctx, this.mapKN[key], key)
		}
	},

	/**
	* @function clone
	* @return {!List} new List
	*/
	clone: function() {
		return new List(this.factory, this.dataKey).foot
	},

	/**
	* @function moveTo
	* @param  {Object} edge unused head or foot node
	* @param  {Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!List} this
	*/
	moveTo: function(edge, parent, before) {
		var foot = this.foot,
				head = this.head,
				origin = head.parentNode,
				cursor = before || null
		// skip case where there is nothing to do
		if ((origin || parent) && cursor !== foot && (origin !== parent || cursor !== foot.nextSibling)) {
			// newParent == null -> remove only -> clear list and dismount head and foot
			if (!parent) {
				setChildren(origin, null, head, foot)
				origin.removeChild(head)
				origin.removeChild(foot)
			}
			// relocate
			else {
				parent.insertBefore(head, cursor)
				parent.insertBefore(foot, cursor)
				setChildren(parent, this, head, foot)
			}
		}
		return foot
	},

	update: function(edge, arr) {
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
			update(node, val, i, arr)
		}

		// update the view
		var parent = this.foot.parentNode
		if (parent) setChildren(parent, this, this.head, this.foot)
		return this.foot
	}
}
