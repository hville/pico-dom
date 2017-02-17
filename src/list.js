var Fragment = require('./fragment'),
		ctyp = require('./util/typ')

module.exports = List

function List(factory, cfg) {
	if (cfg) {
		var dataKey = cfg.dataKey
		switch(ctyp(dataKey)) {
			case Function:
				this.dataKey = dataKey
				break
			case String: case Number:
				this.dataKey = function(v) { return v[dataKey] }
				break
		}
	}
	this.factory = factory
	// lookup maps to locate existing component and delete extra ones
	this.keys = new Map()
	this.ondata = ondata
	Fragment.call(this, [], cfg) //.content, .header, .key, .kinIndex, .ondata, .oninit
}
List.prototype = Fragment.prototype
function ondata(arr) {
	var cnt = this.content,
			keys = this.keys,
			getK = this.dataKey

	cnt.pop() // temporary removal of the footer

	for (var i=0; i<arr.length; ++i) {
		var val = arr[i],
				key = getK(val, i)

		// find item, create Item if it does not exits
		var itm = keys.get(key)
		if (!itm) {
			itm = this.factory({key: key, kinIndex: cnt.length})
			keys.set(key, itm)
			cnt.push(itm)
		}

		// fix content sorting if out of place
		if (itm !== cnt[i]) {
			var idx = i,
					tmpItm = cnt[idx],
					tmpKey = tmpItm.key,
					srcKey = getK(arr[idx], idx)
			//if srcKey === tmpKey, simple swap, else chained insertions
			while (tmpKey !== srcKey && idx < arr.length) {
				cnt[idx] = keys.get(srcKey)
				idx = cnt[idx].kinIndex
				srcKey = getK(arr[idx], idx)
			}
			//final swap
			cnt[idx] = tmpItm
		}

		// fix index and update
		if (itm.kinIndex !== i) itm.kinIndex = i
		cnt[i].ondata(val, i, arr)
	}

	// de-reference leftover items and re-insert the footer
	while (cnt.length>arr.length) {
		var extra = cnt.pop()
		keys.delete(extra.key)
		extra.el.parentNode.removeChild(extra.el)
	}
	cnt.push(this.footer)

	//sync children if mounted
	if (this.parentNode) this.moveBefore(this.parentNode, this.footer)

	// return last inserted item
	return this.footer
}
