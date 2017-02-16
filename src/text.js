var G = require('./util/root')

module.exports = function text(itm) {
	return G.document.createTextNode(itm)
}
