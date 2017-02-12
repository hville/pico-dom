var merge = require('./merge'),
		flatConcat = require('./flat-concat'),
		typ = require('./typ'),
		globals = require('../root/root')

module.exports = createFactory

/**
 * creator to inject settings applicable to many instances (namespace, ...)
 * @param {Function} creator - (sel,opt,cnt)=>instance
 * @param {Object} defaults - shared settings
 * @returns {Function} defining function
 */
function createFactory(creator, defaults) {
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
			return merge(options, arg)
		case Array:
			return flatConcat(content, arg)
		case String: case Number: case Function: case globals.Node: // child-like
			content.push(arg)
	}
}
