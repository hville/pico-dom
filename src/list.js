var Component = require('./component')

module.exports = List

function List(sel, cfg, cnt) {
	// template to generate new dynamic elements
	this.template = new Component(sel, cfg, cnt)
	// function to derive a unique id from the date and re-sort nodes
	this.dataKey = (!cfg || cfg.dataKey === undefined) ? this.getIdx
		: cfg.dataKey.constructor === Function ? cfg.dataKey
		: this.getKey
	// lookup maps to locate existing component and delete extra ones
	this.mIdCo = new Map()
	this.mElId = new WeakMap()
}
List.prototype = {
	constructor: List,
	isList: isList,
	getKey: function getKey(v) { return v[this.uidKey] },
	getIdx: function getIdx(v, i) { return i },
	update: update
}
function isList(o) {
	return (o && o.constructor) === List
}
function update(arr, idx, last) {
	var parent = last.parentNode,
			template = this.template,
			dataKey = this.dataKey,
			mIdCo = this.mIdCo,
			mElId = this.mElId
	// TODO any transmutation ??? newVal = this.updateSelf(val, idx)
	for (var i=0; i<arr.length; ++i) {
		var val = arr[i],
				uid = dataKey(val, i),
				cmp = mIdCo.get(uid)
		if (!cmp) {
			cmp = template.clone({key: uid})
			mIdCo.set(uid, cmp)
			mElId.set(cmp.el, uid)
		}
		last = cmp.update(val, idx + i, last) //idx+i is the child index !== data index

		// insertion
		if (cmp.el === last) last = last.nextSibling
		else parent.insertBefore(cmp.el, last)
	}
	var lastChild = last.previousSibling

	// deletions
	while (last) {
		var next = last.nextSibling
		mIdCo.delete(mElId.get(last))
		parent.removeChild(last)
		last = next
	}
	return lastChild
}
