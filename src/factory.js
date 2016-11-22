var mergeKeys = require('create-element-ns/src/merge-keys'),
		parseArgument = require('create-element-ns/src/parse-argument')

module.exports = createFactory

/**
 * creator to inject settings applicable to many instances (namespace, ...)
 * @param {Function} Constructor - Constructor
 * @param {Object} defaults - shared settings
 * @returns {Function} defining function
 */
function createFactory(Constructor, defaults) {

	// @param {string|Object|Function} [element] - element selector, element or factory function
	// @param {Object} [config] - options
	// @param {string|number|Object|Array} [content] - child string, elements, factory or array of...
	return function define() {
		var context = mergeKeys({}, defaults)
		for (var i=0; i<arguments.length; ++i) {
			mergeKeys(context, parseArgument(arguments[i], i))
		}

		/**
		 * Factory function to produce instances of the defined Component
		 * @param {*} [cfg] - optional additional individual configuration
		 * @returns {Function} individual view function
		 */
		return function factory(cfg) {
			var instance = new Constructor(
				cfg ? mergeKeys(mergeKeys({}, context), cfg) : context
			)
			function view(val, idx, after) {
				return instance.view(val, idx, after)
			}
			return view
		}
	}
}
