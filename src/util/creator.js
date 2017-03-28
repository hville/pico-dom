var ctyp = require('./ctyp'),
		reduce = require('./reduce')

module.exports = function creator(constructor) {
	return function create(defaults) {
		return function define(selector) {
			var options = merge({}, defaults),
					content = []
			for (var i=1; i<arguments.length; ++i) argument(arguments[i], options, content)
			return constructor(selector, options, content)
		}
	}
}
function argument(arg, options, content) {
	switch(ctyp(arg)) {
		case Object:
			merge(options, arg)
			break
		case Array:
			flatConcat(content, arg)
			break
		case null: case undefined:
			break
		case Number:
			content.push(''+arg)
			break
		default:
			content.push(arg)
			break
	}
}
/**
 * @param {...Object} tgt - target object
 * @returns {Object} - modified target
 */
function merge(tgt) {
	for (var i=1; i<arguments.length; ++i) {
		if (arguments[i] != null) tgt = reduce(arguments[i], assign, tgt || {}) //eslint-disable-line eqeqeq
	}
	return tgt
}
function assign(tgt, val, key) {
	tgt[key] = submerge(tgt[key], val)
	return tgt
}
function submerge(tgt, src) {
	switch(ctyp(src)) {
		case Array: return flatConcat(tgt || [], src)
		case Object: return reduce(src, assign, tgt || {})
		case undefined: return tgt
		default: return src //Number, String, Function, Boolean, null
	}
}
function flatConcat(arr, val) {
	if (Array.isArray(val)) for (var i=0; i<val.length; ++i) flatConcat(arr, val[i])
	else arr.push(val)
	return arr
}
