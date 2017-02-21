var W = require('../util/root'),
		decorate = require('../util/decorate'),
		decorators = require('./decorators'),
		ctyp = require('../util/typ'),
		root = require('../util/root')

module.exports = List

function List(factory, cfg) {
	var dKey = cfg && cfg.dataKey
	this.dataKey = !dKey ? getIndex
		: ctyp(dKey) === Function ? dKey
		: function(v) { return v[dKey] }
	this.factory = factory
	// lookup maps to locate existing component and delete extra ones
	this.mapKC = new Map() // dataKey => Context
	this.mapNK = new WeakMap() // node => dataKey
	//required to keep parent ref when no children.length === 0
	this.header = W.document.createComment('^')
	this.footer = W.document.createComment('$')
	decorate(this, cfg, decorators)
	root.extra.set(this.header, this)
	root.extra.set(this.footer, this)
	if (this.oninit) this.oninit(cfg)
}
List.prototype = {
	constructor: List,
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
	ondata: ondata
}
function getIndex(v,i) { return i }
function ondata(arr) {
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
		mapKC.delete(mapNK.get(drop))
		mapNK.delete(drop)
		before = drop.nextSibling
		parent.removeChild(drop)
		drop = before
	}

	// return last inserted item
	return this.footer
}
