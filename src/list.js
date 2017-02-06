var co = require('./co-set').co,
		typ = require('create-element-ns/src/typ')

module.exports = List

function List(elm, cfg, cnt) {
	// function to derive a unique id from the date and re-sort nodes
	this.dataKey = dataKey(cfg.dataKey)
	// factory to generate new dynamic elements
	this.factory = co(elm, cfg, cnt)
	// lookup maps to locate existing component and delete extra ones
	this.mIdCo = new Map()
	this.mElId = new WeakMap()
}
List.prototype.view = view
function dataKey(key) {
	switch(typ(key)) {
		case typ.F: return key
		case typ.S: case typ.N: return function(v) { return v[key] }
		default: return function(v,i) { return i }
	}
}
function view(arr, idx, last) {
	var parent = last.parentNode,
			mIdCo = this.mIdCo,
			mElId = this.mElId

	for (var i=0; i<arr.length; ++i) {
		var val = arr[i],
				uid = this.dataKey(val, i),
				vfn = mIdCo.get(uid)
		if (!vfn) {
			vfn = this.factory({key: uid})
			mIdCo.set(uid, vfn)
		}
		last = vfn(val, idx+i, last)
		mElId.set(last, uid)
	}
	// unmount and de-reference remaining nodes that are part of this list
	while (last.nextSibling) {
		var next = last.nextSibling,
				nKey = mElId.get(next)
		if (nKey !== undefined) {
			mIdCo.delete(nKey)
			parent.removeChild(next)
		}
	}
	return last
}
