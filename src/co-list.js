var List = require('./list')

module.exports = creator

function creator(defaults) {
	define.defaults = defaults

	function define(tagName, config, content) {
		factory.defaults = Object.assign({}, defaults, config)
		factory.isFactory = true

		function factory(cfg) {
			update.context = new List(tagName, Object.assign({}, factory.defaults, cfg), content)
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
