var mergeKeys = require('./merge-keys'),
		parse = require('../elem/parse'),
		flatConcat = require('./flat-concat'),
		typ = require('./typ')

module.exports = createFactory

/**
 * creator to inject settings applicable to many instances (namespace, ...)
 * @param {Function} creator - (sel,opt,cnt)=>instance
 * @param {Object} defaults - shared settings
 * @returns {Function} defining function
 */
function createFactory(creator, defaults) {
	/* definition for a given factory
	 * {string|Object|Function=} [element] - element selector, element or factory function
	 * {Object=} [config] - options
	 * {string|number|Object|Array=} [content] - child string, elements, factory or array of...
	 * {Function} factory function
	 */
	function define(sel) {
		var dex = mergeKeys({}, defaults),
				cnt = [],
				elm

		switch(typ(sel)) {
			case typ.S:
				parse(sel, dex)
				break
			case typ.F: case typ.E:
				elm = sel
				break
			default:
				throw Error('slector must be a function, string or node, not '+ typeof sel)
		}

		for (var i=1; i<arguments.length; ++i) {
			var arg = arguments[i]
			switch(typ(arg)) {
				case typ.O: // config
					mergeKeys(dex, arg)
					break
				case typ.A: case typ.S: case typ.N: case typ.F: case typ.E: // child-like
					flatConcat(cnt, arg)
					break
			}
		}

		/**
		 * Factory function to produce instances of the defined Component
		 * @param {Object=} [opt] - optional additional individual configuration
		 * @returns {Function} individual view function
		 */
		function factory(opt) {
			return creator(elm, opt ? mergeKeys(dex, opt) : dex, cnt)
		}
		return factory
	}
	return define
}
