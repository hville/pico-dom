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
	this.mapKC = new Map() // dataKey => Context
	this.mapNK = new WeakMap() // node => dataKey
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
		var newlist = new List(this.factory, this.dataKey)
		mapEC.set(newlist.footer, newlist)
		mapEC.set(newlist.header, newlist)
		return newlist
	},
	/**
	* @function moveto
	* @param  {Object} parent parentNode
	* @param  {Object} [before] nextSibling
	* @return {Object} header
	*/
	moveto: function moveto(parent, before) {
		var item = this.footer,
				head = this.header
		if (!item.parentNode) {
			parent.appendChild(head)
			parent.appendChild(item)
			return head
		}
		var next = item.previousSibling
		if (item !== before) before = parent.insertBefore(item, before||null)
		while (before !== head) {
			item = next
			next = item.previousSibling
			var ctx = this.mapKC.get(this.mapNK.get(item))
			if (ctx) before = ctx.moveto(parent, before)
			else if (item !== before) before = parent.insertBefore(item, before)
		}
		if (head !== before) before = parent.insertBefore(head, before)
		return before //last insertedChild || first fragmentElement
	},
	update: function update(arr) {
		if (!this.header.parentNode) this.moveto(ENV.document.createDocumentFragment())
		var mapKC = this.mapKC,
				mapNK = this.mapNK,
				getK = this.dataKey,
				before = this.header.nextSibling,
				parent = before.parentNode

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
		var foot = this.footer,
				drop = before
		while (drop !== foot) {
			before = drop.nextSibling
			mapKC.delete(mapNK.get(drop))
			mapNK.delete(drop)
			parent.removeChild(drop)
			drop = before
		}

		return this
	}
}
function getIndex(v,i) {
	return i
}
