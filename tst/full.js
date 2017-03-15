var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		pico = require('../')

var li = pico.li,
		co = pico.co,
		el = pico.el

pico.window = jsdom().defaultView

function concatData(e) {
	for (var i=0, str=''; i<e.childNodes.length; ++i) str+=e.childNodes.item(i).textContent
	return str
}
var coOptions = { ondata: function(v) {
	this.node.textContent = v
}}
var lis = [
	li('div', coOptions),
	li('span', coOptions),
	li('p', coOptions)
]

ct('list-simple', function() {
	var l0 = lis[0]
	ct('==', l0.parentNode, null)
	var comp = co('div#myid', l0),
			elm = comp.node
	comp.update([1,2,3])
	ct('===', concatData(elm), '^123$')
	comp.update([4,3,1,2])
	ct('===', concatData(elm), '^4312$')
	comp.update([1,5,3])
	ct('===', concatData(elm), '^153$')
})
ct('list-stacked', function() {
	var comp = co('div#myid', lis),
			elm = comp.node
	comp.update([1,2,3])
	ct('===', concatData(elm), '^123$^123$^123$')
})
ct('list-complex', function() {
	//list update through parent update
	var liFac = li('td', {
		ondata: function(v,i) {
			this.node.textContent = v.v
			this.node.tabIndex = i
		},
		dataKey: 'k'
	})
	var coObj = co('tr#myid0', {}, liFac),
			coEl = coObj.node
	coObj.update([{k:'one', v:'one'}, {k:'two', v:'two'}, {k:'twe', v:'twe'}], 0)
	ct('===', concatData(coEl), '^onetwotwe$')
})
ct('sequence in nested lists', function() {
	function edit(v, i) {
		this.node.textContent = v
		this.node.tabIndex = i
	}
	var matCo = co('div', {},
		li('p', li('span', {ondata: edit}))
	)
	var matEl = matCo.node
	matCo.update([[11,12,13],[21,22,23],[31,32,33]])
	ct('===', matEl.children.length, 3)
	ct('===', matEl.children[0].children.length, 3)
	ct('===', matEl.children[1].children.length, 3)
	ct('===', matEl.children[2].children.length, 3)
})
ct('list-without component', function() {
	var comp = co('div', li('div', el('h0', 0), el('h1', 1)))
	comp.update([1,2,3])
	ct('===', concatData(comp.node), '^010101$')
})
ct('list-without parent', function() {
	var comp = co('div', li('div', el('h0', 0), el('h1', 1)).update([1,2,3]))
	ct('===', concatData(comp.node), '^010101$')
})
