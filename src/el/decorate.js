var reduce = require('../util/reduce'),
		decorators = require('./decorators')

module.exports = function decorate(elem, opts) {
	return !opts ? elem : reduce(decorators, applyItem, elem, opts)
}
function applyItem(elm, dec, key) {
	return this[key] ? dec(elm, this[key]) : elm
}
