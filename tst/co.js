var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		G = require('../src/util/root'),
		co = require('../src/co')

G.document = jsdom()


var bodyTdInputFac = co('input.tdinput', {
	ondata: function (v) { this.el.value = v; this.children.ondata(v) },
	props: {tabIndex: 1},
	on: {click: function(e) { this.el.value = 'click'; e.target.tabIndex = 11}}
})
ct('co - simple', function() {
	var comp = co('div#myid')(),
			elem = comp.el
	// element
	ct('===', elem.nodeName.toLowerCase(), 'div')
	ct('===', elem.id, 'myid')
})

ct('co - full', function() {
	var c = bodyTdInputFac({props: {id: 'xyz'}}),
			el = c.el
	c.ondata('abc')
	// initial element
	ct('===', el.nodeName.toLowerCase(), 'input')
	ct('===', el.classList.contains('tdinput'), true)
	ct('===', el.tabIndex, 1)
	// init decorators
	ct('===', el.id, 'xyz')
	// view inputs
	ct('===', el.value, 'abc')
	// events .on .handleEvent .eventHandlers
	el.dispatchEvent(new G.window.Event('click'))
	ct('===', el.value, 'click')
	ct('===', el.tabIndex, 11)
})

var cell = co('td', [
	bodyTdInputFac,
	bodyTdInputFac
])()
ct('co - mixed content', function() {
	ct('===', cell.children.content.length, 2)
	var el = cell.el
	cell.ondata('def')
	// initial element
	ct('===', el.nodeName.toLowerCase(), 'td')
	// view inputs
	ct('===', el.childNodes.length, 2+1)
	ct.skip('===', el.firstChild && el.firstChild.value, 'def')
	ct('===', el.lastChild && el.lastChild.value, 'def')
})
