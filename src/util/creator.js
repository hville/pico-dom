var reduce = require('./reduce'),
		text = require('../text')

module.exports = function creator(constructor) {
	return function create(defaults) {
		return function define(selector) {
			var options = defaults || null,
					content = []
			for (var i=1; i<arguments.length; ++i) {
				var arg = arguments[i]
				if (arg && arg.constructor === Object) options = options ? mergeOptions(options, arg) : arg
				else mergeChildren.call(content, arg)
			}
			return constructor(selector, options, content)
		}
	}
}
function mergeChildren(arg) {
	if (arg != null) switch(ctyp(arg)) { //eslint-disable-line eqeqeq
		case Array:
			arg.forEach(mergeChildren, this)
			break
		case Number:
			this.push(text(''+arg))
			break
		case String:
			this.push(text(arg))
			break
		default: this.push(arg)
	}
}
/**
 * @param {Object} tgt - target object
 * @param {Object} src - target object
 * @returns {Object} - modified target
 */
function mergeOptions(tgt, src) {
	if (src != null) tgt = reduce(src, assign, tgt || {}) //eslint-disable-line eqeqeq
	return tgt
}
function assign(tgt, val, key) {
	tgt[key] = submerge(tgt[key], val)
	return tgt
}
function submerge(tgt, src) {
	switch(ctyp(src)) {
		case Array:
			if (!tgt) return src.slice()
			tgt.push.apply(src)
			return tgt
		case Object: return reduce(src, assign, tgt || {})
		case undefined: return tgt
		default: return src //Number, String, Function, Boolean, null
	}
}
function ctyp(t) {
	return t == null ? t //eslint-disable-line eqeqeq
		: t.constructor || Object
}
