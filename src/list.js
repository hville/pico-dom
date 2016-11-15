var Component = require('./component')

module.exports = List

function List(sel, cfg, cnt) {
	if (!cfg) cfg = {}
	// template to generate new dynamic elements
	this.template = new Component(sel, cfg, cnt)
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
			template = this.template,
			dataKey = this.dataKey,
			isDataKeyFn = dataKey && dataKey.constructor === Function,
			mIdCo = this.mIdCo,
			mElId = this.mElId

	for (var i=0; i<arr.length; ++i) {
		var val = arr[i],
				uid = isDataKeyFn ? dataKey(val, i) : (dataKey !== undefined) ? val[dataKey] : i,
				cmp = mIdCo.get(uid)
		if (!cmp) {
			cmp = template.clone({key: uid})
			if (cmp.el.id) cmp.el.removeAttribute('id')

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
