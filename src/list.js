import {extras} from './extras'
import {setChildren, placeChild} from './children'
import {Extra} from './extra'
import {DOC} from './document'

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

	//required to keep parent ref when no children.length === 0
	this.head = DOC.createComment('^')
	this.foot = DOC.createComment('$')
	extras.set(this.head, this)
	extras.set(this.foot, this)
}

var pList = List.prototype
Object.defineProperty(pList, 'nodes', {
	get: function() { return Object.keys(this.mapKC).map(this.get, this) }
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

/**
* @function moveTo
* @param  {Object} parent destination parent
* @param  {Object} [before] nextSibling
* @return {!List} this
*/
pList.moveTo = function(parent, before) { //TODO sanitize parent?
	var foot = this.foot,
			head = this.head,
			origin = head.parentNode,
			target = extras.node(parent),
			cursor = before || null
	// skip case where there is nothing to do
	if ((origin || target) && cursor !== foot && (origin !== target || cursor !== foot.nextSibling)) {
		// newParent == null -> remove only -> clear list and dismount head and foot
		if (!target) {
			setChildren(origin, null, head, foot)
			origin.removeChild(head)
			origin.removeChild(foot)
		}
		// relocate
		else {
			target.insertBefore(head, cursor)
			target.insertBefore(foot, cursor)
			setChildren(target, this.nodes, head, foot)
		}
	}
	return this
}

pList.update = pList.updateSelf = function(arr) {
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
