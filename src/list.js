import {setChildren, placeChild} from './children'
import {Extra} from './extra'
import {Group} from './group'

/**
* @function createList
* @param  {List|Node|Function} model list or component factory or instance to be cloned
* @param  {Function|string|number} [dataKey] record identifier
* @return {!List} new List
*/
export function createList(model, dataKey) {
	var factory = typeof model === 'function' ? model
			: model.clone ? function() { return model.clone(true) }
			: function() { return new Extra(model.cloneNode(true)) }
	return new List(factory, dataKey) //dataKeyMethod??
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
	// lookup maps to locate existing component and delete extra ones
	this.mapKC = {} // dataKey => component, for updating
	this.factory = factory

	Group.call(this)
}

var pList = List.prototype = Object.create(Group.prototype, {
	nodes: {
		get: function() { return Object.keys(this.mapKC).map(this.get, this) }
	}
})

pList.get = function(k) { return this.mapKC[k].node }

pList.dataKey = function(v,i) { return i }

/**
* @function clone
* @return {!List} new List
*/
pList.clone = function() {
	return new List(this.factory, this.dataKey)
}

pList.updateChildren = function(arr) {
	var oldKC = this.mapKC,
			newKC = this.mapKC = {},
			getK = this.dataKey,
			after = this.head,
			foot = this.foot,
			parent = foot.parentNode
	//TODO simplify index keys

	// update the node keyed map
	for (var i=0; i<arr.length; ++i) {
		var val = arr[i],
				key = getK(val, i, arr)
		// find item, create Item if it does not exits
		var extra = newKC[key] = oldKC[key] || this.factory(key, i)
		extra.update(val, i, arr)
		if (parent) after = placeChild(parent, extra.node, after)
	}

	// update the view
	if (parent) setChildren(parent, null, after, foot)
	return this
}
