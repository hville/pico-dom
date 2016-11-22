var is = require('create-element-ns/src/is'),
		Component = require('./component'),
		Factory = require('./factory')

module.exports = List

function List(cfg) {
	// function to derive a unique id from the date and re-sort nodes
	this.dataKey = is.function(cfg.dataKey) ? cfg.dataKey
		: is.stringlike(cfg.dataKey) ? function(v) { return v}
		: function(v,i) { return i}
	// factory to generate new dynamic elements
	this.factory = Factory(Component)(cfg)
	// lookup maps to locate existing component and delete extra ones
	this.mIdCo = new Map()
	this.mElId = new WeakMap()
}
List.prototype.view = view

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
