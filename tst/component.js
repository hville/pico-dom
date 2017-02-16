var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		Component = require('../src/component'),
		el = require('../src/el'),
		G = require('../src/util/root')

G.document = jsdom()

ct('Component - simple', function() {
	var e = el('div#myid'),
			c = new Component(e, {})
	//constructors
	ct('===', c.constructor, Component)
	// element
	ct('===', c.el.nodeName.toLowerCase(), 'div')
	ct('===', c.el.id, 'myid')
})

var bodyTdInput = new Component(el('input.tdinput', {props: {tabIndex: 1}}), {
	ondata: function (v) { this.el.value = v },
	on: {click: function(e) { this.el.value = +this.el.value + 1; e.target.tabIndex = 11}}
})

ct('Component - full, no children', function() {
	var c = bodyTdInput
	// element
	ct('===', c.el.nodeName.toLowerCase(), 'input')
	ct('===', c.el.classList.contains('tdinput'), true)
	ct('===', c.el.tabIndex, 1)
	// component
	ct('===', !!c.on.click, true)
	// updates
	c.ondata(2.1)
	ct('===', c.el.value, '2.1')
	ct('===', c.el.tabIndex, 1)
	// events .on .handleEvent .eventHandlers
	c.el.dispatchEvent(new G.window.Event('click'))
	ct('===', c.el.value, '3.1')
	ct('===', c.el.tabIndex, 11)
})
