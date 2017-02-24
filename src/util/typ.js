var ENV = require('./root')

module.exports = function typ(t) {
	return t == null ? t //eslint-disable-line eqeqeq
		: (t.nodeName && t.nodeType > 0 && t.cloneNode) ? ENV.Node
		: t.constructor || Object
}
