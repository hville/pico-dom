var CE = require('create-element-ns'),
		factory = require('create-element-ns/src/create-factory'),
		List = require('./src/list'),
		coSet = require('./src/co-set')

var getView = coSet.creator(List)

function Li(def) {
	return factory(getView, def)
}
var li = Li()
li.svg = Li({xmlns: CE.namespaces.svg})

module.exports = {
	el: CE.el,
	co: coSet.co,
	li: li,
	Co: coSet.Co,
	Li: Li,
	namespaces: CE.namespaces,
	decorators: CE.decorators,
	global: CE.global,
}
