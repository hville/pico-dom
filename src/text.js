var ENV = require('./env')

module.exports = function text(itm) {
	return ENV.document.createTextNode(itm)
}
