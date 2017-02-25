var creator = require('./util/creator'),
		Component = require('./extra/component'),
		element = require('./el/element'),
		ns = require('./util/namespaces'),
		ENV = require('./util/root'),
		ctyp = require('./util/typ'),
		store = require('./extra/store'),
		Extra = require('../extra/extra')

var preset = creator(function(sel, cfg, cnt) {
	var ref = element(sel, cfg, cnt)
	return new List(function() { return new Component(cloneTree(ref), cfg) }, cfg.dataKey)
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
		: ctyp(dKey) === Function ? dKey
		: function(v) { return v[dKey] }

	// lookup maps to locate existing component and delete extra ones
	this.mapKC = new Map() // dataKey => Context
	this.mapNK = new WeakMap() // node => dataKey
	this.factory = factory

	//required to keep parent ref when no children.length === 0
	this.header = ENV.document.createComment('^')
	this.footer = ENV.document.createComment('$')
	store(this.header, this)
	store(this.footer, this)
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
	ondata: function ondata(arr) {
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

		// return last inserted item
		return foot
	}
}
function getIndex(v,i) {
	return i
}
function cloneTree(model) {
	var clone, modelC
	// clone the model as it is: Element, Component or List
	if (model.nodeType) {
		clone = model.cloneNode(false)
		modelC = model.firstChild
	}
	else if (model.factory) {
		clone = new List(model.factory, model.dataKey)
		modelC = null
		store(clone.footer, clone)
		store(clone.header, clone)
	}
	else {
		clone = new Extra(model.cloneNode(false), { oninit: model.oninit, ondata: model.ondata, onmove: model.onmove, on: model.on() }) //TODO on...
		modelC = model.node.firstChild
		store(clone.node, clone)
	}

	// recursively clone children
	while(modelC) {
		modelC = store(modelC) || modelC
		var cloneC = cloneTree(modelC)
		if (cloneC.nodeType) {
			clone.appendChild(cloneC)
			modelC = modelC.nextSibling
		}
		else if (cloneC.factory) {
			cloneC.moveto(clone)
			modelC = modelC.footer.nextSibling
		}
		else {
			cloneC.moveto(clone)
			modelC = modelC.node.nextSibling
		}
	}
	return clone
}
