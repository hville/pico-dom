var flatConcat = require('./flat-concat'),
		typ = require('./typ'),
		reduce = require('./reduce')

module.exports = function(tgt) {
	for (var i=1; i<arguments.length; ++i) {
		if (arguments[i] != null) tgt = reduce(arguments[i], assign, tgt || {}) //eslint-disable-line eqeqeq
	}
	return tgt
}
function assign(tgt, val, key) {
	tgt[key] = merge(tgt[key], val)
	return tgt
}
function merge(tgt, src) {
	switch(typ(src)) {
		case Array: return flatConcat(tgt || [], src)
		case Object: return reduce(src, assign, tgt || {})
		case undefined: return tgt
		default: return src //Number, String, Function, Boolean, null
	}
}
