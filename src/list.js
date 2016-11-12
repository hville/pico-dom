var Component = require('./component')

module.exports = List

function List(sel, cfg, cnt) {
	// template to generate new dynamic elements
	this.template = new Component(sel, cfg, cnt)
	// function to derive a unique id from the date and re-sort nodes
	this.dataKey = (cfg && cfg.dataKey !== undefined) ? cfg.dataKey : getIdx
	// lookup maps to locate existing component and delete extra ones
	this.mIdCo = new Map()
	this.mElId = new WeakMap()
}
List.prototype = {
	constructor: List,
	isList: isList,
	view: view
}
function isList(o) {
	return (o && o.constructor) === List
}
function view(arr, idx, last) {
	var parent = last.parentNode,
			template = this.template,
			dataKey = this.dataKey,
			isDataKeyFn = dataKey.constructor === Function,
			mIdCo = this.mIdCo,
			mElId = this.mElId
	// TODO any transmutation ??? newVal = this.viewSelf(val, idx)
	for (var i=0; i<arr.length; ++i) {
		var val = arr[i],
				uid = isDataKeyFn ? dataKey(val, i) : val[dataKey],
				cmp = mIdCo.get(uid)
		if (!cmp) {
			cmp = template.clone({key: uid})
			mIdCo.set(uid, cmp)
			mElId.set(cmp.el, uid)
		}
		last = cmp.view(val, idx+i, last)
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
function getIdx(v, i) {
	return i
}
