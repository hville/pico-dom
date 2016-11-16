var CE = require('create-element-ns'),
		factory = require('./src/factory'),
		List = require('./src/list'),
		Component = require('./src/component')

var co = factory(Component),
		li = factory(List),
		el = CE.el

co.svg = factory(Component, {xmlns: 'http://www.w3.org/2000/svg'})
li.svg = factory(List, {xmlns: 'http://www.w3.org/2000/svg'})

module.exports = {
	co: co,
	li: li,
	el: el,
	Co: function(cfg) { return factory(Component, cfg) },
	Li: function(cfg) { return factory(List, cfg) },
	namespaces: CE.namespaces,
	decorators: CE.decorators,
	global: CE.global,
	factory: factory,
	Component: Component,
	List: List
}
