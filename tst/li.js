var pico = require('../index'),
		jsdom = require('jsdom'),
		ct = require('cotest')

var document = jsdom.jsdom(),
		li = pico.li,
		co = pico.co

pico.global.document = document

ct('empty list', function() {
	var minFac = li(''),
			minView = minFac()
	// constructors
	ct('===', minFac.isFactory, true)
	ct('===', minView.isView, true)
})

var liFac = li('td', {
	edit: function(v,i) {
		this.el.textContent = v.v
		this.el.tabIndex = i
	},
	dataKey: 'k'
})
var coFac = co('tr#myid0', {}, liFac),
		coView = coFac(),
		liView = liFac()

ct('nested List, function types and constructors', function() {
	// constructors
	ct('===', liFac.isFactory, true)
	ct('===', coFac.isFactory, true)
	ct('===', liView.isView, true)
	ct('===', coView.isView, true)
})
ct('list update through parent update', function() {
	var coEl = coView([{k:'one', v:'one'}, {k:'two', v:'two'}, {k:'twe', v:'twe'}], 0)
	ct('===', coEl.childNodes.length, 3)
	ct('===', coEl.lastChild.tabIndex, 2)
	ct('===', coEl.lastChild.textContent, 'twe')
})
ct('sequence in nested lists', function() {
	function edit(v, i) {
		this.el.textContent = v
		this.el.tabIndex = i
	}
	var matCo = co('div', {},
		li('p', {},
			li('span', {edit: edit})
		)
	)()
	var matEl = matCo([[11,12,13],[21,22,23],[31,32,33]])
	ct('===', matEl.childNodes.length, 3)
	ct('===', matEl.childNodes[0].childNodes.length, 3)
	ct('===', matEl.childNodes[1].childNodes.length, 3)
	ct('===', matEl.childNodes[2].childNodes.length, 3)
})
