var creator = require('./util/creator'),
		Component = require('./co/component'),
		element = require('./el/element'),
		ns = require('./namespaces'),
		ENV = require('./env'),
		cloneChildren = require('./util/clone-child'),
		comment = require('./comment')

var mapEC = ENV.extra

var preset = creator(function(sel, cfg, cnt) {
	var ref = element(sel, cfg, cnt)
	function factory() {
		return new Component(cloneChildren(ref.cloneNode(false), ref.firstChild), cfg)
	}
	return new List(factory, cfg.dataKey)
})

var li = preset()
li.svg = preset({xmlns: ns.svg})
li.preset = preset

module.exports = li

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
	this.mapNK = new WeakMap() // node => dataKey, for deleting KC entries...
	this.factory = factory

	//required to keep parent ref when no children.length === 0
	this.header = comment('^')
	this.footer = comment('$')
	mapEC.set(this.header, this)
	mapEC.set(this.footer, this)
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
			var ctx = mapEC.get(item)
			if (ctx) before = ctx.moveto(parent, before)
		}
		if (head !== before) before = parent.insertBefore(head, before)
		return before //last insertedChild || first fragmentElement
	},
	update: function update(arr) {
		var head = this.header,
				parent = head.parentNode
		if (!parent) throw Error('list.updates requires a parentNode')
		var mapKC = this.mapKC,
				mapNK = this.mapNK,
				getK = this.dataKey,
				before = head.nextSibling

		for (var i=0; i<arr.length; ++i) {
			var val = arr[i],
					key = getK(val, i)
			// find item, create Item if it does not exits
			var itm = mapKC.get(key)
			if (!itm) {
				itm = this.factory()
				mapNK.set(itm.node, key)
				mapKC.set(key, itm)
			}
			if (before !== itm.node) parent.insertBefore(itm.node, before)
			before = itm.node.nextSibling
			itm.ondata(val, key, arr)
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
				mapNK = this.mapNK,
				stop = after || this.header,
				drop = foot

		while ((drop = foot.previousSibling) !== stop) {
			mapKC.delete(mapNK.get(drop))
			mapNK.delete(drop)
			parent.removeChild(drop)
		}
		return this
	}
}
function getIndex(v,i) {
	return i
}
