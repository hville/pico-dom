var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		List = require('../src/list'),
		co = require('../src/co'),
		Fr = require('../src/fragment'),
		globals = require('../src/util/root')

globals.document = jsdom()

function li(sel, opt, cnt) {
	return function() {
		return new List(co(sel,opt,cnt))
	}
}
var coOptions = { ondata: function(v) {
	this.el.textContent = v
}}
var lis = [
	li('div', coOptions),
	li('span', coOptions),
	li('p', coOptions)
]

ct('list-simple', function() {
	var l0 = lis[0]
	ct('===', l0().constructor, Fr)
	ct('==', l0().content.length, 0)
	ct('==', l0().header.parentNode, null)
	var comp = co('div#myid', l0)(),
			el = comp.el
	ct('===', el.children.length, 0, 'no content, 1 fragment, 1 list')
	comp.ondata([1,2,3])
	ct('===', el.children.length, 3)
	ct.skip('==', el.firstChild.textContent, 1)
	ct('==', el.lastChild && el.lastChild.textContent, 3)
	comp.ondata([4])
	ct('===', el.children.length, 1)
})
ct('list-stacked', function() {
	var comp = co('div#myid', lis)(),
			el = comp.el
	ct('===', el.children.length, 0)
	comp.ondata([1,2,3])
	ct('===', el.children.length, 9)
	ct.skip('==', el.firstChild.textContent, 1)
	ct('==', el.lastChild.textContent, 3)
})
