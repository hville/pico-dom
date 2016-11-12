var Component = require('./component')

module.exports = creator

function creator(defaults) {
	define.defaults = defaults

	function define(tagName, config, content) {
		factory.template = new Component(tagName, Object.assign({}, define.defaults, config), content)
		factory.isFactory = true


		function factory(cfg) {
			view.context = factory.template.clone(cfg)
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
