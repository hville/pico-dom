var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		Component = require('../src/co/component'),
		el = require('../src/el'),
		G = require('../src/util/root')

G.document = jsdom()

ct('Component - simple', function() {
	var e = el('div#myid')(),
			c = new Component(e, {})
	//constructors
	ct('===', c.constructor, Component)
	// element
	ct('===', c.node.nodeName.toLowerCase(), 'div')
	ct('===', c.node.id, 'myid')
})

var bodyTdInput = new Component(el('input.tdinput', {props: {tabIndex: 1}})(), {
	ondata: function (v) { this.node.value = v },
	on: {click: function(e) { this.node.value = +this.node.value + 1; e.target.tabIndex = 11}}
})

ct('Component - full, no children', function() {
	var c = bodyTdInput
	// element
	ct('===', c.node.nodeName.toLowerCase(), 'input')
	ct('===', c.node.classList.contains('tdinput'), true)
	ct('===', c.node.tabIndex, 1)
	// component
	ct('===', c.on().indexOf('click'), 0)
	// updates
	c.ondata(2.1)
	ct('===', c.node.value, '2.1')
	ct('===', c.node.tabIndex, 1)
	// events .on .handleEvent .eventHandlers
	c.node.dispatchEvent(new G.window.Event('click'))
	ct('===', c.node.value, '3.1')
	ct('===', c.node.tabIndex, 11)
})
