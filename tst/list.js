var pico = require('../index'),
		jsdom = require('jsdom'),
		ct = require('cotest')

var document = jsdom.jsdom(),
		domAPI = pico.dom,
		List = pico.List

domAPI.document = document
//TODO view() with edge cases el((li()))
ct('simple List: .isList .template .dataKey', function() {
	var l = new List('div#myid'),
			t = l.template
	// constructors
	ct('===', l.isList(l), true)
	ct('===', l.constructor, List)
	// template
	ct('===', t.isComponent(t), true)
	ct('===', t.el.nodeName.toLowerCase(), 'div')
})
ct('nested List, dataKeyString', function() {
	var l = new List('tr#myid0', {}, [
		new List('td', {
			edit: function(v,i) {
				this.el.textContent = v.v
				this.el.tabIndex = i
			},
			dataKey: 'k'
		})
	])
	var t = l.template,
			tl = t.content[0]
	// constructors
	ct('===', l.isList(l), true)
	ct('===', tl.isList(l), true)
	ct('===', l.isList(tl), true)
	ct('===', tl.isList(tl), true)
	ct('===', tl.constructor, List)
	// update Template Component
	t.view([{k:'one', v:'one'}, {k:'two', v:'two'}, {k:'twe', v:'twe'}], 0)
	ct('===', t.el.childNodes.length, 3)
	ct('===', t.el.firstChild && t.el.firstChild.tabIndex, 0)
	ct('===', t.el.firstChild && t.el.firstChild.textContent, 'one')
	ct('===', t.el.lastChild && t.el.lastChild.tabIndex, 2)
	ct('===', t.el.lastChild && t.el.lastChild.textContent, 'twe')
	//resort
	t.view([{k:'two', v:'two'}, {k:'twe', v:'twe'},{k:'one', v:'one'}], 0)
	ct('===', t.el.lastChild && t.el.lastChild.tabIndex, 2)
	ct('===', t.el.lastChild && t.el.lastChild.textContent, 'one')
})
ct('nested List, dataKeyFn', function() {
	var l = new List('tr#myid0', {}, [
		new List('td', {
			edit: function(v,i) {
				this.el.textContent = v.v
				this.el.tabIndex = i
			},
			dataKey: function(v) { return v.k }
		})
	])
	var t = l.template
	// update Template Component
	t.view([{k:'one', v:'one'}, {k:'two', v:'two'}, {k:'twe', v:'twe'}], 0)
	ct('===', t.el.childNodes.length, 3)
	ct('===', t.el.firstChild && t.el.firstChild.tabIndex, 0)
	ct('===', t.el.firstChild && t.el.firstChild.textContent, 'one')
	ct('===', t.el.lastChild && t.el.lastChild.tabIndex, 2)
	ct('===', t.el.lastChild && t.el.lastChild.textContent, 'twe')
	// clear Map Lookups
	t.view([{k:'fow', v:'fow'}], 0)
	ct('===', t.content.length, 1)
	ct('===', t.content[0].mIdCo.size, 1)
})
