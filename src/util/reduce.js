export function reduce(obj, fcn, res, ctx) {
	for (var i=0, ks=Object.keys(obj); i<ks.length; ++i) res = fcn.call(ctx, res, obj[ks[i]], ks[i], obj)
	return res
}

export function assign(target, source) {
	for (var i=0, ks=Object.keys(source); i<ks.length; ++i) target[ks[i]] = source[ks[i]]
	return target
}
