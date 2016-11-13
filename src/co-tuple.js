var Component = require('./component')

module.exports = creator

/**
 * main creator to inject settings applicable to many components (store, namespace, ...)
 * @param {Object} defaults - shared settings
 * @returns {function} component defining function
 */
function creator(defaults) {
	define.defaults = defaults
	/**
	 * Component definition
	 * @param {string|Object|function} tagName - element selector, definition of factory function
	 * @param {Object} [config] - options
	 * @param {string|number|Object|Array} [content] - individual or array of elements, components of factories
	 * @returns {function} factory function
	 */
	function define(tagName, config, content) {
		factory.template = new Component(tagName, Object.assign({}, define.defaults, config), content)
		factory.isFactory = true
		/**
		 * Factory function to produce instances of the defined Component
		 * @param {any} [cfg] - optional additional individual configuration
		 * @returns {function} individual view function
		 */
		function factory(cfg) {
			view.context = factory.template.clone(cfg)
			view.isView = true
			/**
			 * View function to update the component and content
			 * @param {any} [val] - value to be passed to self and content
			 * @param {any} [idx] - child index
			 * @param {any} [after] - last updated parent child where to start the update
			 * @returns {Object} updated DOM element
			 */
			function view(val, idx, after) {
				return view.context.view(val, idx, after)
			}
			return view
		}
		return factory
	}
	return define
}
