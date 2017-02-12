var flatConcat = require('./flat-concat'),
		typ = require('./typ')

// shallow clone - 2 levels - to merge attributes, properties, elements and other options
module.exports = function mergeKeys(tgt, src) {
	if(typ(src) === typ.O) for (var i=0, ks=Object.keys(src); i<ks.length; ++i) {
		var key = ks[i]
		tgt[key] = merge(tgt[key], src[key])
	}
	return tgt
}
function merge(tgt, src) {
	switch(typ(src)) {
		case typ.A:
			return flatConcat(tgt || [], src)
		case typ.E:
			return src.cloneNode(true)
		case typ.O:
			return assign(tgt || {}, src)
		default:
			return src
	}
}
function assign(tgt, src) {
	for (var i=0, ks=Object.keys(src); i<ks.length; ++i) tgt[ks[i]] = src[ks[i]]
	return tgt
}
