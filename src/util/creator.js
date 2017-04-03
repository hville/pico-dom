var text = require('../text')

module.exports = function creator(constructor) {
	return function create(defaults) {
		return function define(selector) {
			var options = defaults ? [defaults] : [],
					content = []
			for (var i=1; i<arguments.length; ++i) {
				var arg = arguments[i]
				if (arg && arg.constructor === Object) options.push(arg)
				else mergeChildren.call(content, arg)
			}
			return constructor(selector, options, content)
		}
	}
}
function mergeChildren(arg) {
	if (arg != null) switch(ctyp(arg)) { //eslint-disable-line eqeqeq
		case Array:
			arg.forEach(mergeChildren, this)
			break
		case Number:
			this.push(text(''+arg))
			break
		case String:
			this.push(text(arg))
			break
		default: this.push(arg)
	}
}
function ctyp(t) {
	return t == null ? t //eslint-disable-line eqeqeq
		: t.constructor || Object
}
