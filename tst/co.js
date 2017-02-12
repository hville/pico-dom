var pico = require('../index'),
		jsdom = require('jsdom'),
		ct = require('cotest')

var document = jsdom.jsdom(),
		DOM = document.defaultView,
		co = pico.co

pico.global.document = document

var bodyTdInputFac = co('input.tdinput', {
	ondata: function (v) { this.el.value = v },
	props: {tabIndex: 1},
	on: {click: function(e) { this.el.value = 'click'; e.target.tabIndex = 11}}
})
ct('simple Component: .el', function() {
	var comp = co('div#myid'),
			view = comp(),
			elem = view()
	// element
	ct('===', elem.nodeName.toLowerCase(), 'div')
	ct('===', elem.id, 'myid')
})

ct('full Component', function() {
	var c = bodyTdInputFac({props: {id: 'xyz'}}),
			el = c('abc')
	// initial element
	ct('===', el.nodeName.toLowerCase(), 'input')
	ct('===', el.classList.contains('tdinput'), true)
	ct('===', el.tabIndex, 1)
	// init decorators
	ct('===', el.id, 'xyz')
	// view inputs
	ct('===', el.value, 'abc')
	// events .on .handleEvent .eventHandlers
	el.dispatchEvent(new DOM.Event('click'))
	ct('===', el.value, 'click')
	ct('===', el.tabIndex, 11)
})

var cell = co('td', [
	bodyTdInputFac,
	bodyTdInputFac
])()
ct('mixed content', function() {
	var el = cell('def')
	// initial element
	ct('===', el.nodeName.toLowerCase(), 'td')
	// view inputs
	ct('===', el.childNodes.length, 2)
	ct('===', el.firstChild && el.firstChild.value, 'def')
	ct('===', el.lastChild && el.lastChild.value, 'def')
})