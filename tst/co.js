var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		G = require('../src/util/root'),
		co = require('../src/co')

G.document = jsdom()

var bodyTdInputFac = co('input.tdinput', {
	ondata: function (v) {
		this.node.value = v
		this.children.forEach(function(child) { if (child.ondata) child.ondata(v) })
	},
	props: {tabIndex: 1},
	on: {click: function(e) { this.node.value = 'click'; e.target.tabIndex = 11}}
})
ct('co - simple', function() {
	var comp = co('div#myid')(),
			elem = comp.node
	// element
	ct('===', elem.nodeName.toLowerCase(), 'div')
	ct('===', elem.id, 'myid')
})

ct('co - full', function() {
	var c = bodyTdInputFac({props: {id: 'xyz'}}),
			el = c.node
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
	var el = cell.node
	cell.ondata('def')
	//for (var i=0, lst=el.childNodes, typ=[]; i<lst.length; ++i) typ.push(lst.item(i).nodeType)
	//console.log(typ)
	// initial element
	ct('===', el.nodeName.toLowerCase(), 'td')
	// view inputs
	ct('===', el.childNodes.length, 2+1)
	ct('===', el.childNodes.item(0).value, 'def')
	ct('===', el.childNodes.item(1).value, 'def')
})
