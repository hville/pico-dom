var List = require('./list'),
		CE = require('create-element-ns')

var mergeKeys = CE.mergeKeys

module.exports = creator

/**
 * main creator to inject settings applicable to many lists (store, namespace, ...)
 * @param {Object} [defaults] - shared settings
 * @returns {function} list defining function
 */
function creator(defaults) {
	/**
	 * List definition
	 * @param {string|Object|function} tagName - element selector, definition of factory function
	 * @param {Object} [config] - options
	 * @param {string|number|Object|Array} [content] - individual or array of elements, components of factories
	 * @returns {function} factory function
	 */
	function define(tagName, config, contentxxx) {
		/**
		 * Factory function to produce instances of the defined List
		 * @param {any} [cfg] - optional additional individual configuration
		 * @returns {function} individual view function
		 */
		function factory(cfg) {
			/**
			 * View function to update the list
			 * @param {any} [val] - array to iterated for each list element
			 * @param {any} [idx] - child index of the first list element
			 * @param {any} [after] - last updated parent child where to start the update
			 * @returns {Object} last updated DOM element of the set
			 */
			function view(val, idx, after) {
				return view.context.view(val, idx, after)
			}
			view.context = new List(tagName, mergeKeys({}, factory.defaults, cfg), content)
			view.isView = true
			return view
		}
		factory.defaults = mergeKeys({}, define.defaults, config)
		factory.isFactory = true
		return factory
	}
	define.defaults = defaults
	return define
}
