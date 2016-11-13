var pico = require('../index'),
		jsdom = require('jsdom'),
		ct = require('cotest')

var document = jsdom.jsdom(),
		DOM = document.defaultView,
		domAPI = pico.dom,
		Component = pico.Component

domAPI.document = document

ct('simple Component: .el .clone .isComponent', function() {
	var c = new Component('div#myid')
	//constructors
	ct('===', c.isComponent(c), true)
	ct('===', c.clone().isComponent(c), true)
	ct('===', c.isComponent(c.clone()), true)
	ct('===', c.constructor, Component)
	// element
	ct('===', c.el.nodeName.toLowerCase(), 'div')
	// safe clone - remove id
	ct('===', c.el.id, 'myid')
	ct('===', c.clone().el.id, '')
})

var bodyTdInput = new Component('input.tdinput', {
	edit: function (v) { this.el.value = v },
	props: {tabIndex: 1},
	on: {click: function(e) { this.el.value = +this.el.value + 1; e.target.tabIndex = 11}}
})

ct('full Component - no children', function() {
	var c = bodyTdInput.clone()
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
	// clone
	var clone = c.clone({key: 'ckey'})
	ct('===', clone.el.nodeName.toLowerCase(), 'input')
	ct('===', clone.el.classList.contains('tdinput'), true)
	ct('===', clone.el.tabIndex, 11)
	ct('===', c.view.constructor, Function)
	ct('===', !!clone.eventHandlers.click, true)
	ct('===', clone.key, 'ckey')
})

var bodyTdCell = new Component('td.tbodycell', {
	edit: bcellEdit,
	props: {tabIndex: 1},
	on: {click: function() { this.focus = !this.focus }}
})
function bcellEdit(v, i) {
	this.el.tabIndex = i
	this.setContent(this.focus ? bodyTdInput.clone({properties: {value: v}}) : v)
}

ct('full Component - with children', function() {
	var c = bodyTdCell.clone()
	// updates - not focused
	c.view(1.1, 11)
	ct('===', c.el.textContent, '1.1')
	ct('===', c.el.tabIndex, 11)
	ct('===', !!c.focus, false)
	// toggle state - not updated yet
	c.el.dispatchEvent(new DOM.Event('click'))
	ct('===', c.el.textContent, '1.1')
	ct('===', c.el.tabIndex, 11)
	ct('===', c.focus, true)
	// update - focused
	c.view(2.2, 22)
	ct('===', c.content[0] && c.content[0].el && c.content[0].el.tagName.toLowerCase(), 'input')
	ct('===', c.el.firstChild && c.el.firstChild.value, '2.2')//
	ct('===', c.el.tabIndex, 22)
	ct('===', c.focus, true)
	// toggle state - not updated yet
	c.el.dispatchEvent(new DOM.Event('click'))
	ct('===', c.content[0] && c.content[0].el && c.content[0].el.tagName.toLowerCase(), 'input')
	ct('===', c.el.firstChild && c.el.firstChild.value, '2.2')//
	ct('===', c.el.tabIndex, 22)
	ct('===', c.focus, false)
	// updates - not focused
	c.view(3.3, 33)
	ct('===', c.el.textContent, '3.3')
	ct('===', c.el.tabIndex, 33)
	ct('===', c.focus, false)
})
