var ENV = require('./env')

module.exports = function fragment() {
	return ENV.document.createDocumentFragment()
}
