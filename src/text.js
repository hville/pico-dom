var ENV = require('./env')

module.exports = function (string) {
	return ENV.document.createTextNode(string)
}
