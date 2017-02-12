module.exports = typ

function typ(t) {
	return t == null ? t //eslint-disable-line eqeqeq
		: (t.nodeName && t.nodeType > 0 && t.cloneNode) ? typ.E
		: t.constructor || Object
}
typ.A = Array
typ.S = String
typ.N = Number
typ.F = Function
typ.E = function(){} // for case where Node|Element is not yet defined
typ.O = Object
