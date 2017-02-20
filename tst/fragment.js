var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		Fr = require('../src/fragment'),
		el = require('../src/el'),
		globals = require('../src/util/root')

globals.document = jsdom()

function fr(cnt, opt) {
	return function() { return new Fr(cnt, opt) }
}
function concatData(e) {
	for (var i=0, str=''; i<e.childNodes.length; ++i) str+=e.childNodes.item(i).data
	return str
}
var frs = [
	fr(['1','2','3']),
	fr(['4','5','6']),
	fr(['7','8','9'])
]

ct('fragment-single', function() {
	var f = frs[0]()
	ct('===', f.constructor, Fr)
	ct('==', f.length, 3)
	var e = el('div#myid', frs[0])()
	ct('===', concatData(e), '123$')
})
ct('fragment-stacked', function() {
	var e = el('div#myid', frs[0], frs[1], frs[2])()
	ct('===', concatData(e), '123$456$789$')
})
ct('fragment-grouped', function() {
	var e = el('div#myid', fr([frs[0], frs[1], frs[2]]))()
	ct('===', concatData(e), '123$456$789$$')
	var f = fr([frs[0], frs[1], frs[2]])()
	ct('==', f.length, 3)
	ct('==', f.content[0].length, 3)
})
ct('fragment-turtles...', function() {
	var e = el('div#myid', fr([fr([frs[0], frs[1]]), fr([frs[2]])]))()
	ct('===', concatData(e), '123$456$$789$$$')
	var f = fr([fr([frs[0], frs[1]]), fr([frs[2]])])()
	ct('==', f.length, 2)
	ct('==', f.content[0].length, 2)
	ct('==', f.content[1].length, 1)
})
