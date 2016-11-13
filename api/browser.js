var Table = require('./table')

var table = Table()

document.body.appendChild(table({
	val: {ra: {ca: 'aa', cb: 'ab'}, rb: {ca: 'ba', cb: 'bb'}},
	srt: [['ra', 'rb'], ['ca', 'cb']],
	sel: ['rb', 'ca']
}))
