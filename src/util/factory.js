var merge = require('./merge-object'),
		flatConcat = require('./flat-concat'),
		typ = require('./typ'),
		G = require('../util/root')

/**
 * creator to inject settings applicable to many instances (namespace, ...)
 * @param {Function} creator - (sel,opt,cnt)=>instance
 * @param {Object} defaults - shared settings
 * @returns {Function} defining function
 */
module.exports = function createFactory(creator, defaults) {
	return function define(selector) {
		var options = merge({}, defaults),
				content = []
		for (var i=1; i<arguments.length; ++i) argument(arguments[i], options, content)
		return creator(selector, options, content)
	}
}
function argument(arg, options, content) {
	switch(typ(arg)) {
		case Object:
			merge(options, arg)
			break
		case Array:
			flatConcat(content, arg)
			break
		case String: case Number: case Function: case G.Node: // child-like
			content.push(arg)
			break
		case null: case undefined:
			break
		default:
			throw Error('invalid argument: ' + typeof arg + ':' + arg)
	}
}
