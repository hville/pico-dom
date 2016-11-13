var pico = require('../index'),
		jsdom = require('jsdom'),
		ct = require('cotest')

var document = jsdom.jsdom()
pico.dom.document = document

var Table = require('./table')

var table = Table()

document.body.appendChild(table({
	val: {ra: {ca: 'aa', cb: 'ab'}, rb: {ca: 'ba', cb: 'bb'}},
	srt: [['ra', 'rb'], ['ca', 'cb']],
	sel: ['rb', 'ca']
}))

ct('table', function() {
	var svgEl = document.body.firstChild.firstChild,
			tableEl = svgEl.nextSibling,
			tbodyEl = tableEl.childNodes[1]
	ct('===', svgEl.tagName.toLowerCase(), 'svg')
	ct('===', tableEl.tagName.toLowerCase(), 'table')
	ct('===', tableEl.childNodes.length, 3)
	ct('===', tbodyEl.tagName.toLowerCase(), 'tbody')
	ct('===', tbodyEl.childNodes.length, 2)
})
