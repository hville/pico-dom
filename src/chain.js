var CE = require('create-element-ns')

var mergeKeys = CE.mergeKeys

module.exports = creator

/**
 * main creator to inject settings applicable to many instances (store, namespace, ...)
 * @param {function} Constructor - shared settings
 * @param {Object} defaults - shared settings
 * @returns {function} defining function
 */
function creator(Constructor, defaults) {
	/**
	 * Component definition
	 * @param {string|Object|function} element - element selector, definition of factory function
	 * @param {Object} [config] - options
	 * @param {string|number|Object|Array} [content] - individual or array of elements, components of factories
	 * @returns {function} factory function
	 */
	function define(element, config, content) {
		/**
		 * Factory function to produce instances of the defined Component
		 * @param {any} [cfg] - optional additional individual configuration
		 * @returns {function} individual view function
		 */
		function factory(cfg) {
			/**
			 * View function to update the component and content
			 * @param {any} [val] - value to be passed to self and content
			 * @param {any} [idx] - child index
			 * @param {any} [after] - last updated parent child where to start the update
			 * @returns {Object} updated DOM element
			 */
			function view(val, idx, after) {
				return view.instance.view(val, idx, after)
			}
			view.instance = new factory.Constructor(
				factory.element,
				mergeKeys({}, factory.config, cfg),
				factory.content
			)
			view.isView = true
			return view
		}
		factory.element = element
		factory.config = mergeKeys({}, define.defaults, config)
		factory.content = content
		factory.Constructor = define.Constructor
		factory.isFactory = true
		return factory
	}
	define.Constructor = Constructor
	define.defaults = defaults
	return define
}
