var Component = require('./component')

module.exports = creator

function creator(defaults) {
	define.defaults = defaults

	function define(tagName, config, content) {
		factory.template = new Component(tagName, Object.assign({}, define.defaults, config), content)
		factory.isFactory = true


		function factory(cfg) {
			update.context = factory.template.clone(cfg)
			update.isUpdate = true

			function update(val, idx, nextSibling) {
				return update.context.update(val, idx, nextSibling)
			}
			return update
		}
		return factory
	}
	return defaults
}
