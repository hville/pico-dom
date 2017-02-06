var pico = require('../index'),
		jsdom = require('jsdom'),
		ct = require('cotest'),
		CE = require('create-element-ns'),
		Component = require('../src/Component')

var document = jsdom.jsdom(),
		DOM = document.defaultView

pico.global.document = document

ct('simple Component: .el', function() {
	var f = CE.el('div#myid'),
			e = f(),
			c = new Component(e, {})
	//constructors
	ct('===', c.constructor, Component)
	// element
	ct('===', c.el.nodeName.toLowerCase(), 'div')
	ct('===', c.el.id, 'myid')
})

var bodyTdInput = new Component(CE.el('input.tdinput')({props: {tabIndex: 1}}), {
	ondata: function (v) { this.el.value = v },
	on: {click: function(e) { this.el.value = +this.el.value + 1; e.target.tabIndex = 11}}
})

ct('full Component - no children', function() {
	var c = bodyTdInput
	// element
	ct('===', c.el.nodeName.toLowerCase(), 'input')
	ct('===', c.el.classList.contains('tdinput'), true)
	ct('===', c.el.tabIndex, 1)
	// component
	ct('===', c.view.constructor, Function)
	ct('===', !!c.eventHandlers.click, true)
	// updates
	c.view(2.1)
	ct('===', c.el.value, '2.1')
	ct('===', c.el.tabIndex, 1)
	// events .on .handleEvent .eventHandlers
	c.el.dispatchEvent(new DOM.Event('click'))
	ct('===', c.el.value, '3.1')
	ct('===', c.el.tabIndex, 11)
})

