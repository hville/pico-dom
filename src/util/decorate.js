var reduce = require('./reduce')

module.exports = function decorate(elem, opts, decorators) {
	return !opts ? elem : reduce(decorators, applyItem, elem, opts)
}
function applyItem(elm, dec, key) {
	return this[key] ? dec(elm, this[key], key) : elm
}
