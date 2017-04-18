export function reduce(obj, fcn, res, ctx) {
	for (var i=0, ks=Object.keys(obj); i<ks.length; ++i) res = fcn.call(ctx, res, obj[ks[i]], ks[i], obj)
	return res
}

export function setter(obj, val, key) {
	if (obj[key] !== val) obj[key] = val
	return obj
}

export function assign(tgt, src) {
	return src ? reduce(src, setter, tgt) : tgt
}

export function assignKeys(tgt, src) {
	return src ? reduce(src, assignKey, tgt) : tgt
}

function assignKey(tgt, val, key) {
	if (typeof val === 'object') tgt[key] = assign(tgt[key] || {}, val)
	else if (tgt[key] !== val) tgt[key] = val
	return tgt
}
