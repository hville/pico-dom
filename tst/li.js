var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		li = require('../src/li'),
		co = require('../src/co'),
		Fr = require('../src/co/fragment'),
		globals = require('../src/util/root')

globals.document = jsdom()

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
	ct('===', l0().constructor, Fr)
	ct('==', l0().content.length, 0+1)
	ct('==', l0().parentNode, null)
	var comp = co('div#myid', l0)(),
			el = comp.node
	ct('===', el.childNodes.length, 0+1+1, 'no content, 1 fragment, 1 list')
	comp.ondata([1,2,3])
	ct('===', concatData(el), '123$$')
	comp.ondata([4,3,1,2])
	ct('===', concatData(el), '4312$$')
	comp.ondata([1,5,3])
	ct('===', concatData(el), '153$$')
})
ct('list-stacked', function() {
	var comp = co('div#myid', lis)(),
			el = comp.node
	ct('===', el.childNodes.length, 0+3+1)
	comp.ondata([1,2,3])
	ct('===', concatData(el), '123$123$123$$')
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
	var coFac = co('tr#myid0', {}, liFac),
			coObj = coFac(),
			coEl = coObj.node
	coObj.ondata([{k:'one', v:'one'}, {k:'two', v:'two'}, {k:'twe', v:'twe'}], 0)
	ct('===', concatData(coEl), 'onetwotwe$$')
})
ct('sequence in nested lists', function() {
	function edit(v, i) {
		this.node.textContent = v
		this.node.tabIndex = i
	}
	var matCo = co('div', {},
		li('p', li('span', {ondata: edit}))
	)()
	var matEl = matCo.node
	matCo.ondata([[11,12,13],[21,22,23],[31,32,33]])
	ct('===', matEl.children.length, 3)
	ct('===', matEl.children[0].children.length, 3)
	ct('===', matEl.children[1].children.length, 3)
	ct('===', matEl.children[2].children.length, 3)
})
