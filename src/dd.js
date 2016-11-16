function createFactory(creator, defaults) {
	return function define(/*element, config, content*/) {
		var context = mergeKeys({}, defaults)
		for (var i=0; i<arguments.length; ++i) mergeKeys(context, parseArgument(arguments[i], i))
		function factory(cfg) {
			return creator(context, cfg)
		}
		factory.isFactory = true
		return factory
	}
}
module.exports = function newCreator(Constructor) {
	return function creator(context, cfg) {
		var instance = new Constructor(
			cfg ? mergeKeys(mergeKeys({}, context), cfg) : context
		)
		function view(val, idx, after) {
			return instance.view(val, idx, after)
		}
		view.isView = true
		return view
	}
}
