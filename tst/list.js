var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		li = require('../src/list'),
		co = require('../src/co'),
		ENV = require('../src/env')

ENV.window = jsdom().defaultView

function concatData(e) {
	for (var i=0, str=''; i<e.childNodes.length; ++i) str+=e.childNodes.item(i).textContent
	return str
}
var coOptions = {
	extra: {
		update: function(v,i) {this.node.textContent = v}
	}
}

ct('list-simple', function() {
	var l0 = li(co('div', coOptions))
	//var l0 = li(function() {return co('div', coOptions)})
	ct('==', l0.parentNode, null)
	var comp = co('div#myid', l0),
			el = comp.node
	comp.update([1,2,3])
	ct('===', concatData(el), '^123$')//3
	comp.update([4,3,1,2])
	ct('===', concatData(el), '^4312$')//2
	comp.update([1,5,3])
	ct('===', concatData(el), '^153$')//3
	ct('===', l0.clear(), l0)
	ct('===', concatData(el), '^$')
	ct('===', l0.moveto(null), l0)
	ct('===', concatData(el), '')
})
ct('list-stacked', function() {
	var comp = co('div#myid', [
				li(co('div', coOptions)),
				li(co('span', coOptions)),
				li(co('p', coOptions))
			]),
			el = comp.node
	comp.update([1,2,3])
	ct('===', concatData(el), '^123$^123$^123$')
})
ct('list-complex', function() {
	//list update through parent update
	var liFac = li(co('td', {
		update: function(v,i) {
			this.node.textContent = v.v
			this.node.tabIndex = i
		}
	}), 'k')
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
