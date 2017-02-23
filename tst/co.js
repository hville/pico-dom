var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		G = require('../src/util/root'),
		co = require('../src/co'),
		store = require('../src/extra/store')

G.document = jsdom()

var bodyTdInputFac = co('input.tdinput', {
	oninit: function() {
		var updateChildren = this.ondata
		this.ondata = function(v) { this.node.value = v; updateChildren.call(this, v) }
	},
	props: {tabIndex: 1},
	on: {click: function(e) { this.node.value = 'click'; e.target.tabIndex = 11}}
})
ct('co - simple', function() {
	var elem = co('div#myid')()
	// element
	ct('===', elem.nodeName.toLowerCase(), 'div')
	ct('===', elem.id, 'myid')
})

ct('co - full', function() {
	var el = bodyTdInputFac({props: {id: 'xyz'}}),
			c = store(el)
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

var el = co('td', [
	bodyTdInputFac,
	bodyTdInputFac
])()
ct('co - mixed content', function() {
	var cell = store(el)
	cell.ondata('def')
	//for (var i=0, lst=el.childNodes, typ=[]; i<lst.length; ++i) typ.push(lst.item(i).nodeType)
	//console.log(typ)
	// initial element
	ct('===', el.nodeName.toLowerCase(), 'td')
	// view inputs
	ct('===', el.childNodes.item(0).value, 'def')
	ct('===', el.childNodes.item(1).value, 'def')
})
