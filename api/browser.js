var Table = require('./table')

var tableCo = Table()
//console.log('tableCo', tableCo)
var tableEl = tableCo({
	val: {ra: {ca: 'aa', cb: 'ab'}, rb: {ca: 'ba', cb: 'bbbb'}},
	srt: [['ra', 'rb'], ['ca', 'cb']],
	sel: ['rb', 'ca']
})
//console.log('tableEl', tableEl)

document.body.appendChild(tableEl)
