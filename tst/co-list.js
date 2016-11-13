var pico = require('../index'),
		jsdom = require('jsdom'),
		ct = require('cotest')

var document = jsdom.jsdom(),
		domAPI = pico.dom,
		li = pico.liCreator(),
		co = pico.coCreator()

domAPI.document = document

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
