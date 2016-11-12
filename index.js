var coList = require('./src/co-list'),
		coTuple = require('./src/co-typle')

var co = coTuple(),
		li = coList()

co.svg = coTuple({xmlns: 'http://www.w3.org/2000/svg'})
li.svg = coList({xmlns: 'http://www.w3.org/2000/svg'})

module.exports = {
	co: co,
	li: li,
	liCreator: coList,
	coCreator: coTuple
	//TODO element decorators
	//TODO dom.document
	//TODO namespaces
	//TODO component decorators (for plugins/app/store/dispatcher)
}
