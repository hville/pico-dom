var W = require('./util/root')

module.exports = function text(itm) {
	return W.document.createTextNode(itm)
}
