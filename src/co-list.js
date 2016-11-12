var List = require('./list')

module.exports = creator

function creator(defaults) {
	define.defaults = defaults

	function define(tagName, config, content) {
		factory.defaults = Object.assign({}, defaults, config)
		factory.isFactory = true

		function factory(cfg) {
			view.context = new List(tagName, Object.assign({}, factory.defaults, cfg), content)
			view.isView = true

			function view(val, idx, nextSibling) {
				return view.context.view(val, idx, nextSibling)
			}
			return view
		}
		return factory
	}
	return define
}
