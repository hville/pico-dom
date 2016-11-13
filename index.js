var crEl = require('create-element-ns'),
		coList = require('./src/co-list'),
		coTuple = require('./src/co-tuple'),
		List = require('./src/list'),
		Component = require('./src/component')

var co = coTuple(),
		li = coList(),
		el = crEl.el

co.svg = coTuple({xmlns: 'http://www.w3.org/2000/svg'})
li.svg = coList({xmlns: 'http://www.w3.org/2000/svg'})

module.exports = {
	co: co,
	li: li,
	el: el,
	liCreator: coList,
	coCreator: coTuple,
	namespaces: crEl.namespaces,
	decorators: crEl.decorators,
	dom: crEl.dom,
	Component: Component,
	List: List
}
