var domAPI = require('../src/dom-api'),
		jsdom = require('jsdom'),
		ct = require('cotest'),
		co = require('../src/comp')

var document = jsdom.jsdom(),
		DOM = document.defaultView

domAPI.document = document

var bodyTdInput = co('input.tdinput', {
	view: function binputView(v) { this.el.value = v },
	props: {tabIndex: 1},
	on: {click: function() { this.el.value = +this.el.value + 1}}
})

ct('table body input', function() {
	var c = bodyTdInput
	//constructors
	ct('===', c.isCo(c), true)
	ct('===', c.clone().isCo(c), true)
	ct('===', c.isCo(c.clone()), true)
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
	// events
	c.el.dispatchEvent(new DOM.Event('click'))
	ct('===', c.el.value, '3.1')
	// clone
	var clone = c.clone({key: 'ckey'})
	ct('===', clone.el.nodeName.toLowerCase(), 'input')
	ct('===', clone.el.classList.contains('tdinput'), true)
	ct('===', clone.el.tabIndex, 1)
	ct('===', c.view.constructor, Function)
	ct('===', !!clone.eventHandlers.click, true)
	ct('===', clone.key, 'ckey')
}, true)

var btdSelected = false
var bodyTd = h('td', btdView, {
	on: {focus: function() { btdSelected = true }}
})
function btdView(v, i) {
	this.el.tabIndex = i
	if (!btdSelected) this.el.textContent = v
	else {
		this.setContent(v, 0, bodyTdInput).setChildren() //fail
	}
}

ct('table td cell with different mode', function() {
	var c = bodyTd
	// normal view
	c.view('x')
	ct('===', btdSelected, false)
	ct('===', c.el.textContent, 'x')
	// selected view
	c.el.dispatchEvent(new DOM.Event('focus'))
	ct('===', btdSelected, true)
	c.view('x')
	//console.log(c.content)
	ct('!==', c.el.textContent, 'x')
	ct('===', c.el.childNodes.length, 1)
	ct('===', c.content[0].el.tagName.toLowerCase(), 'input')
	ct('===', c.el.firstChild.value, 'x')
})
