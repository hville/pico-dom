var CE = require('create-element-ns'),
		coList = require('./src/create-li'),
		coTuple = require('./src/create-co'),
		List = require('./src/list'),
		Component = require('./src/component')

var co = coTuple(),
		li = coList(),
		el = CE.el

co.svg = coTuple({xmlns: 'http://www.w3.org/2000/svg'})
li.svg = coList({xmlns: 'http://www.w3.org/2000/svg'})

module.exports = {
	co: co,
	li: li,
	el: el,
	namespaces: CE.namespaces,
	decorators: CE.decorators,
	global: CE.global,
	Li: coList,
	Co: coTuple,
	Component: Component,
	List: List
}
