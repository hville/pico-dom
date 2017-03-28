var ENV = require('./env')

module.exports = function text(string) {
	return ENV.document.createTextNode(string)
}
