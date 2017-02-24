var ENV = require('./util/root')

module.exports = function text(itm) {
	return ENV.document.createTextNode(itm)
}
