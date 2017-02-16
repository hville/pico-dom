var flatConcat = require('./flat-concat'),
		typ = require('./typ'),
		reduce = require('./reduce')

module.exports = function(tgt, src) {
	return reduce(src, assign, tgt || {})
}
function assign(tgt, val, key) {
	tgt[key] = merge(tgt[key], val)
	return tgt
}
function merge(tgt, src) {
	switch(typ(src)) {
		case Array: return flatConcat(tgt || [], src)
//	case G.Node: return src.cloneNode(true)
		case Object: return reduce(src, assign, tgt || {})
		case undefined: return tgt
		default: return src //Number, String, Function, Boolean, null
	}
}

