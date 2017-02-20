var merge = require('./merge-object'),
		flatConcat = require('./flat-concat'),
		typ = require('./typ'),
		G = require('./root')

module.exports = function creator(constructor) {
	return function create(defaults) {
		return function define(selector) {
			var options = merge({}, defaults),
					content = []
			for (var i=1; i<arguments.length; ++i) argument(arguments[i], options, content)
			return function factory(config) {
				var cfg = config ? merge({}, options, config) : options
				return constructor(selector, cfg, content)
			}
		}
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
