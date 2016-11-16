var Component = require('./component'),
		factory = require('./factory')

var co = factory(Component)

module.exports = List

function List(cfg) {
	// factory to generate new dynamic elements
	this.factory = co(cfg)
	// function to derive a unique id from the date and re-sort nodes
	this.dataKey = cfg.dataKey
	// lookup maps to locate existing component and delete extra ones
	this.mIdCo = new Map()
	this.mElId = new WeakMap()
	// callback on instance
	this.init = cfg.init
	if (this.init) this.init(cfg)
}
List.prototype = {
	constructor: List,
	isList: isList,
	view: view,
}
function isList(o) {
	return (o && o.constructor) === List
}
function view(arr, idx, last) {
	var parent = last.parentNode,
			factory = this.factory,
			dataKey = this.dataKey,
			isDataKeyFn = dataKey && dataKey.constructor === Function,
			mIdCo = this.mIdCo,
			mElId = this.mElId

	for (var i=0; i<arr.length; ++i) {
		var val = arr[i],
				uid = isDataKeyFn ? dataKey(val, i) : (dataKey !== undefined) ? val[dataKey] : i,
				vfn = mIdCo.get(uid)
		if (!vfn) {
			vfn = factory({key: uid})
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
