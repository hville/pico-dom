var G = require('./root')

module.exports = typ

function typ(t) {
	return t == null ? t //eslint-disable-line eqeqeq
		: (t.nodeName && t.nodeType > 0 && t.cloneNode) ? G.Node
		: t.constructor || Object
}
