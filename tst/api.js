var global = require('../index').global,
		jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		Table = require('../api/table')

global.document = jsdom()

ct('table component', function() {
	var tableCo = Table()

	var tableDiv = tableCo({
		val: {ra: {ca: 'aa', cb: 'ab'}, rb: {ca: 'ba', cb: 'bbbb'}},
		srt: [['ra', 'rb'], ['ca', 'cb']],
		sel: ['rb', 'ca']
	})
	var tableEl = tableDiv.firstChild
	global.document.body.appendChild(tableDiv)

	ct('===', global.document.body.lastChild, tableDiv)
	ct('===', tableEl.childNodes.length, 3)
})

