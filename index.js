var CE = require('create-element-ns'),
		factory = require('./src/factory'),
		List = require('./src/list'),
		Component = require('./src/component')

var co = factory(Component),
		li = factory(List)

function Co(cfg) {
	return factory(Component, cfg)
}
function Li(cfg) {
	return factory(List, cfg)
}

co.svg = Co({xmlns: 'http://www.w3.org/2000/svg'})
li.svg = Li({xmlns: 'http://www.w3.org/2000/svg'})

module.exports = {
	el: CE.el,
	co: co,
	li: li,
	Co: Co,
	Li: Li,
	Component: Component,
	List: List,
	factory: factory,
	namespaces: CE.namespaces,
	decorators: CE.decorators,
	global: CE.global,
}
