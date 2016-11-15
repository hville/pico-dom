var CE = require('create-element-ns'),
		chain = require('./src/chain'),
		List = require('./src/list'),
		Component = require('./src/component')

var co = chain(Component),
		li = chain(List),
		el = CE.el

co.svg = chain(Component, {xmlns: 'http://www.w3.org/2000/svg'})
li.svg = chain(List, {xmlns: 'http://www.w3.org/2000/svg'})

module.exports = {
	co: co,
	li: li,
	el: el,
	namespaces: CE.namespaces,
	decorators: CE.decorators,
	global: CE.global,
	chain: chain,
	Component: Component,
	List: List
}
