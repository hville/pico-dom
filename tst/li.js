var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		li = require('../src/li'),
		co = require('../src/co'),
		Fr = require('../src/fragment'),
		globals = require('../src/util/root')

globals.document = jsdom()

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
	ct('===', el.childNodes.length, 0+1+1, 'no content, 1 fragment, 1 list')
	comp.ondata([1,2,3])
	ct('===', el.childNodes.length, 3+1+1)
	//ct.skip('==', e.firstChild.textContent, 1)
	ct('==', el.lastChild && el.lastChild.textContent, 3)
})
ct('list-stacked', function() {
	var comp = co('div#myid', lis)(),
			el = comp.el
	ct('===', el.childNodes.length, 0+3+1)
	comp.ondata([1,2,3])
	ct('===', el.childNodes.length, 9+3+1)
	ct.skip('==', el.firstChild.textContent, 1)
	ct('==', el.lastChild.textContent, 3)
})
ct('list-complex', function() {
	//list update through parent update
	var liFac = li('td', {
		ondata: function(v,i) {
			this.el.textContent = v.v
			this.el.tabIndex = i
		},
		dataKey: 'k'
	})
	var coFac = co('tr#myid0', {}, liFac),
			coObj = coFac(),
			coEl = coObj.el
	coObj.ondata([{k:'one', v:'one'}, {k:'two', v:'two'}, {k:'twe', v:'twe'}], 0)
	ct('===', coEl.childNodes.length, 3+1+1)
	ct('===', coEl.lastChild.tabIndex, 2)
	ct('===', coEl.lastChild.textContent, 'twe')
})
ct('sequence in nested lists', function() {
	function edit(v, i) {
		this.el.textContent = v
		this.el.tabIndex = i
	}
	var matCo = co('div', {},
		li('p', li('span', {ondata: edit}))
	)()
	var matEl = matCo.el
	matCo.ondata([[11,12,13],[21,22,23],[31,32,33]])
	ct('===', matEl.children.length, 3)
	ct('===', matEl.children[0].children.length, 3)
	ct('===', matEl.children[1].children.length, 3)
	ct('===', matEl.children[2].children.length, 3)
})
