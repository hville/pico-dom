/**
 * @function
 * @param {!Object} obj
 * @param {Function} fcn
 * @param {*} [ctx]
 * @returns {void}
 */
export function eachKeys(obj, fcn, ctx) {
	for (var i=0, ks=Object.keys(obj); i<ks.length; ++i) fcn.call(ctx, ks[i], obj[ks[i]])
}
