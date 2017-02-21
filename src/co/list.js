var W = require('../util/root'),
		decorate = require('../util/decorate'),
		decorators = require('./decorators'),
		ctyp = require('../util/typ')

module.exports = List

function List(factory, cfg) {
	this.content = []
	var dKey = cfg && cfg.dataKey
	this.dataKey = !dKey ? getIndex
		: ctyp(dKey) === Function ? dKey
		: function(v) { return v[dKey] }
	this.factory = factory
	// lookup maps to locate existing component and delete extra ones
	this.mapKI = new Map()
	this.mapIK = new WeakMap()
	//required to keep parent ref when no children.length === 0
	//this.header = W.document.createComment('^')
	this.footer = W.document.createComment('$')
	decorate(this, cfg, decorators)
	if (this.oninit) this.oninit(cfg)
}
List.prototype = {
	constructor: List,
	moveto: function moveto(parent, before) {
		if (this.footer !== before) before = parent.insertBefore(this.footer, before || null)
		var content = this.content,
				i = content.length
		while (i--) {
			var child = content[i].node || content[i]
			if (child !== before) before = child.moveto ? child.moveto(parent, before) : parent.insertBefore(child, before)
		}
		return before //last insertedChild || first fragmentElement
	},
	ondata: ondata
}
function getIndex(v,i) { return i }
function ondata(arr) {
	var cnt = this.content,
			mapKI = this.mapKI, //key=>itm
			mapIK = this.mapIK, //itm=>key, only used to ref and de-ref mapKI
			getK = this.dataKey

	for (var i=0; i<arr.length; ++i) {
		var val = arr[i],
				key = getK(val, i)

		// find item, create Item if it does not exits
		var itm = mapKI.get(key)
		if (!itm) {
			itm = this.factory()
			mapIK.set(itm, key)
			mapKI.set(key, itm)
			cnt.push(itm)
		}

		// fix content sorting if out of place
		if (itm !== cnt[i]) {
			var idx = i,
					tmpItm = cnt[idx],
					srcItm = mapKI.get(getK(arr[idx], idx))
			//if srcKey === tmpKey, simple swap, else chained insertions
			if (idx < arr.length) while (tmpItm !== srcItm) {
				cnt[idx] = srcItm
				srcItm = mapKI.get(getK(arr[idx], idx))
			}
			//final swap
			cnt[idx] = tmpItm
		}

		// fix index and update
		cnt[i].ondata(val, i, arr)
	}

	// de-reference leftover items and re-insert the footer
	while (cnt.length>arr.length) {
		var extra = cnt.pop(),
				node = extra.node || extra
		mapKI.delete(mapIK.get(extra))
		mapIK.delete(extra)
		node.parentNode.removeChild(node)
	}

	//sync children if mounted
	if (this.footer.parentNode) this.moveto(this.footer.parentNode, this.footer)

	// return last inserted item
	return this.footer
}
