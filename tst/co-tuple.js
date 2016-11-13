var pico = require('../index'),
		jsdom = require('jsdom'),
		ct = require('cotest')

var document = jsdom.jsdom(),
		DOM = document.defaultView,
		domAPI = pico.dom,
		co = pico.coCreator()

domAPI.document = document

var bodyTdInputFac = co('input.tdinput', {
	edit: function (v) { this.el.value = v },
	props: {tabIndex: 1},
	on: {click: function(e) { this.el.value = 'click'; e.target.tabIndex = 11}}
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

var cell = co('td', {}, [
	bodyTdInputFac,
	bodyTdInputFac({props: {id: 'xyz'}})
])()
ct('mixed content', function() {
	var el = cell('def')
	// initial element
	ct('===', el.nodeName.toLowerCase(), 'td')
	ct('===', el.lastChild.id, 'xyz')
	// view inputs
	ct('===', el.childNodes.length, 2)
	ct('===', el.firstChild.value, 'def')
	ct('===', el.lastChild.value, 'def')
})

