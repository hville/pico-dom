var factory = require('./src/util/create-factory'),
		List = require('./src/list'),
		coSet = require('./src/co-set'),
		ns = require('./src/util/namespaces'),
		el = require('./src/elem/elem'),
		root = require('./src/root/root')

var getView = coSet.creator(List)

function Li(def) {
	return factory(getView, def)
}
var li = Li()
li.svg = Li({xmlns: ns.svg})

module.exports = {
	el: el,
	co: coSet.co,
	li: li,
	Co: coSet.Co,
	Li: Li,
	namespaces: ns,
	global: root,
}
