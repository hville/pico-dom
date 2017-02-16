var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		Fr = require('../src/fragment'),
		el = require('../src/el'),
		child = require('../src/util/create-child'),
		globals = require('../src/util/root')

globals.document = jsdom()

function fr(cnt, opt) {
	return function() { return new Fr(cnt.map(child), opt) }
}

var frs = [
	fr(['1','2','3']),
	fr(['4','5','6']),
	fr(['7','8','9'])
]

ct('fragment-single', function() {
	var f = frs[0]()
	ct('===', f.constructor, Fr)
	ct('==', f.content.length, 3)
	var e = el('div#myid', frs[0])
	ct('===', e.childNodes.length, 3+1)
	ct.skip('==', e.firstChild.data, 1)
	ct('==', e.lastChild.data, 3)
})
ct('fragment-stacked', function() {
	var e = el('div#myid', frs[0], frs[1], frs[2])
	ct('===', e.childNodes.length, 9+3)
	ct.skip('==', e.firstChild.data, 1)
	ct('==', e.lastChild.data, 9)
})
ct('fragment-grouped', function() {
	var e = el('div#myid', fr([frs[0], frs[1], frs[2]]))
	ct('===', e.childNodes.length, 9+4)
	ct.skip('==', e.firstChild.data, 1)
	ct('==', e.lastChild.data, 9)
	var f = fr([frs[0], frs[1], frs[2]])()
	ct('==', f.content.length, 3)
	ct('==', f.content[0].content.length, 3)

})
ct('fragment-turtles...', function() {
	var e = el('div#myid', fr([fr([frs[0], frs[1]]), fr([frs[2]])]))
	ct('===', e.childNodes.length, 9+6)
	ct.skip('==', e.firstChild.data, 1)
	ct('==', e.lastChild.data, 9)
	var f = fr([fr([frs[0], frs[1]]), fr([frs[2]])])()
	ct('==', f.content.length, 2)
	ct('==', f.content[0].content.length, 2)
	ct('==', f.content[1].content.length, 1)
})
