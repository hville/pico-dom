import {setProperty, assignKey} from './reducers'

export function reduce(obj, fcn, res, ctx) {
	for (var i=0, ks=Object.keys(obj); i<ks.length; ++i) res = fcn.call(ctx, res, obj[ks[i]], ks[i], obj)
	return res
}

export function assign(tgt, src) {
	return src ? reduce(src, setProperty, tgt) : tgt
}

export function assignKeys(tgt, src) {
	return src ? reduce(src, assignKey, tgt) : tgt
}
