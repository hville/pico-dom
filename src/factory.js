var CE = require('create-element-ns')

var mergeKeys = CE.mergeKeys,
		parseArgument = CE.parseArgument

module.exports = createFactory

/**
 * creator to inject settings applicable to many instances (namespace, ...)
 * @param {function} Constructor - Constructor
 * @param {Object} defaults - shared settings
 * @returns {function} defining function
 */
function createFactory(Constructor, defaults) {
	/**
	 * definition for a given factory
	 * @param {string|Object|function} [element] - element selector, element or factory function
	 * @param {Object} [config] - options
	 * @param {string|number|Object|Array} [content] - child string, elements, factory or array of...
	 * @returns {function} factory function
	 */
	return function define(/*element, config, content*/) {
		var context = mergeKeys({}, defaults)
		for (var i=0; i<arguments.length; ++i) mergeKeys(context, parseArgument(arguments[i], i))
		/**
		 * Factory function to produce instances of the defined Component
		 * @param {any} [cfg] - optional additional individual configuration
		 * @returns {function} individual view function
		 */
		function factory(cfg) {
			var instance = new Constructor(
				cfg ? mergeKeys(mergeKeys({}, context), cfg) : context
			)
			function view(val, idx, after) {
				return instance.view(val, idx, after)
			}
			view.isView = true
			return view
		}
		factory.isFactory = true
		return factory
	}
}
