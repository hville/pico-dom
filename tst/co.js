var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		pico = require('../index.js')

var co = pico.component

pico.window = jsdom().defaultView

var bodyTdInputFac = function(cfg) {
	return co('input.tdinput', cfg, {
		extra: {
			update: function(v) {
				this.node.value = v
				this.updateChildren(v)
			},
			handleEvent: function(e) {
				this.node.value = 'click'; e.target.tabIndex = 11
			},
			init: function() {
				this.node.addEventListener('click', this, false)
			}
		},
		props: {
			tabIndex: 1
		}
	})
}
ct('co - simple', function() {
	var elem = co('div#myid').node
	// element
	ct('===', elem.nodeName.toLowerCase(), 'div')
	ct('===', elem.id, 'myid')
})

ct('co - full', function() {
	var c = bodyTdInputFac({props: {id: 'xyz'}}),
			el = c.node
	c.update('abc')
	// initial element
	ct('===', el.nodeName.toLowerCase(), 'input')
	ct('===', el.classList.contains('tdinput'), true)
	ct('===', el.tabIndex, 1)
	// init decorators
	ct('===', el.id, 'xyz')
	// view inputs
	ct('===', el.value, 'abc')
	// events .on .handleEvent .eventHandlers
	el.dispatchEvent(new pico.window.Event('click'))
	ct('===', el.value, 'click')
	ct('===', el.tabIndex, 11)
})
ct('co - mixed content', function() {
	var cell = co('td', [
		bodyTdInputFac(),
		bodyTdInputFac()
	])
	var el = cell.node
	cell.update('def')
	//for (var i=0, lst=el.childNodes, typ=[]; i<lst.length; ++i) typ.push(lst.item(i).nodeType)
	//console.log(typ)
	// initial element
	ct('===', el.nodeName.toLowerCase(), 'td')
	// view inputs
	ct('===', el.childNodes.item(0).value, 'def')
	ct('===', el.childNodes.item(1).value, 'def')
})
ct('co - cloning', function() {
	var model = co('td', [
		bodyTdInputFac(),
		bodyTdInputFac()
	])
	var cell = model.clone()
	var el = cell.node
	cell.update('def')
	//for (var i=0, lst=el.childNodes, typ=[]; i<lst.length; ++i) typ.push(lst.item(i).nodeType)
	//console.log(typ)
	// initial element
	ct('!==', cell, model)
	ct('!==', cell.node, model.node)
	ct('===', cell.update, model.update)
	ct('===', cell.handleEvent, model.handleEvent)
	ct('===', cell.init, model.init)
	ct('===', el.nodeName.toLowerCase(), 'td')
	// view inputs
	ct('===', el.childNodes.item(0) && el.childNodes.item(0).value, 'def')
	ct('===', el.childNodes.item(1) && el.childNodes.item(1).value, 'def')
})
