var ENV = require('../env')

module.exports = function ctyp(t) {
	var constructor = t == null ? t //eslint-disable-line eqeqeq
		: (t.nodeName && t.nodeType && t.cloneNode) ? ENV.Node
		: t.constructor || Object
	if (arguments.length === 1) return constructor
	for (var i=1; i<arguments.length; ++i) if (constructor === arguments[i]) return true
	return false
}
