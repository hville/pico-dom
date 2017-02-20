var Fragment = require('./fragment'),
		ctyp = require('./util/typ')

module.exports = list

function list(factory, cfg) {
	var fr = new Fragment([], cfg)
	if (cfg) {
		var dataKey = cfg.dataKey
		switch(ctyp(dataKey)) {
			case Function:
				fr.dataKey = dataKey
				break
			case String: case Number:
				fr.dataKey = function(v) { return v[dataKey] }
				break
		}
	}
	fr.factory = factory
	// lookup maps to locate existing component and delete extra ones
	fr.mapKI = new Map()
	fr.mapIK = new WeakMap()
	fr.ondata = ondata
	return fr
}
function ondata(arr) {
	var cnt = this.content,
			mapKI = this.mapKI,
			mapIK = this.mapIK,
			getK = this.dataKey

	cnt.pop() // temporary removal of the footer

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
					tmpKey = mapIK.get(tmpItm),
					srcKey = getK(arr[idx], idx)
			//if srcKey === tmpKey, simple swap, else chained insertions
			if (idx < arr.length) while (tmpKey !== srcKey) {
				cnt[idx] = mapKI.get(srcKey)
				srcKey = getK(arr[idx], idx)
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
	cnt.push(this.footer)

	//sync children if mounted
	if (this.parentNode) this.moveto(this.parentNode, this.footer)

	// return last inserted item
	return this.footer
}
