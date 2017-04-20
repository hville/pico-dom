var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		P = require('../dist/index.js')

P.setDefaultView(jsdom().defaultView)

var li = P.createList,
		co = P.createComponent,
		el = P.createElement

function concatData(e) {
	for (var i=0, str=''; i<e.childNodes.length; ++i) str+=e.childNodes.item(i).textContent
	return str
}
var coOptions = {
	extra: {
		update: function(v) {this.node.textContent = v}
	}
}

ct('list static-element', function() {
	var l0 = li(el('p', 'x'))
	var comp = co('div', l0)
	comp.update([1,2,3])
	ct('===', concatData(comp.node), '^xxx$')//3
	comp.update([4,3,1,2])
	ct('===', concatData(comp.node), '^xxxx$')//2
	comp.update([1,5,3])
	ct('===', concatData(comp.node), '^xxx$')//3
})
ct('list-simple', function() {
	var l0 = li(co('div', coOptions))
	//var l0 = li(function() {return co('div', coOptions)})
	ct('==', l0.parentNode, null)
	var comp = co('div#myid', l0),
			elm = comp.node
	comp.update([1,2,3])
	ct('===', concatData(elm), '^123$')//3
	comp.update([4,3,1,2])
	ct('===', concatData(elm), '^4312$')//2
	comp.update([1,5,3])
	ct('===', concatData(elm), '^153$')//3
})
ct('list-stacked', function() {
	var comp = co('div#myid', [
				li(co('div', coOptions)),
				li(co('span', coOptions)),
				li(co('p', coOptions))
			]),
			elm = comp.node
	ct('===', concatData(elm), '^$^$^$')
	comp.update([1,2,3])
	ct('===', concatData(elm), '^123$^123$^123$')
})
ct('list-complex', function() {
	//list update through parent update
	var liFac = li(co('td', { extra: {
		update: function(v,i) {
			this.node.textContent = v.v
			this.node.tabIndex = i
		}
	}}), 'k')
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
		li(co('p',
			li(co('span', {update: edit}))
		))
	)
	var matEl = matCo.node
	matCo.update([[11,12,13],[21,22,23],[31,32,33]])
	ct('===', matEl.children.length, 3)
	ct('===', matEl.children[0].children.length, 3)
	ct('===', matEl.children[1].children.length, 3)
	ct('===', matEl.children[2].children.length, 3)
})
