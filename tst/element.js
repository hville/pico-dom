var ct = require('cotest'),
		P = require('../dist/index.js')

if (!P.D) {
	// @ts-ignore
	var JSDOM = require('jsdom').JSDOM //eslint-disable-line global-require
	var win = (new JSDOM).window
	P.setDocument(win.document)
}


var el = P.element

function toString(nodes) {
	var str = ''
	if (nodes) for (var i=0; i<nodes.length; ++i) str+=nodes[i].textContent
	return str
}

ct('element - static', function() {
	ct('===', el('p').create().node.nodeType, 1)

	// explicit
	ct('===', toString(el('p').append('ab').create().node.childNodes), 'ab')
	ct('===', el('p').call(function() {this.node.id = 'A'}).create().node.id, 'A')
	ct('===', el('p').attr('id', 'A').create().node.id, 'A')

	// automagic
	ct('===', toString(el('p', 'ab').create().node.childNodes), 'ab')
	ct('===', el('p', function() {this.node.id = 'A'}).create().node.id, 'A')
	ct('===', el('p', {attrs: {'data-id': 'A'}, props: {id: 'A'}}).create().node.id, 'A')
})

ct('element - mixed children', function() {
	ct('===', el('p').append([0, el('p')], el('p'), [el('p')]).create().node.childNodes.length, 4)
	ct('===', el('p').append(el('p'), [], el('p'), [el('p'), 0]).create().node.childNodes.length, 4)
	ct('===', el('p').append(el('p'), null, 0, [el('p'), el('p')]).create().node.childNodes.length, 4)
})

ct('element - static, multiple mixed arguments', function() {
	var p = el('p').append(0).class('A').append(1).prop('id', 'B').append(2).create().node
	ct('===', p.nodeType, 1)
	ct('===', p.firstChild.nodeValue, '0')
	ct('===', p.className, 'A')
	ct('===', p.id, 'B')
	ct('===', p.lastChild.nodeValue, '2')
	ct('===', p.textContent, '012')
})

ct('element - root', function() {
	var h1 = {},
			h2 = {}
	var h0 = el('h0').append(
		el('h1').call(function() {h1 = this}),
		el('h2').call(function() {h2 = this})
	).create().extra('a', 'a')
	ct('===', h1.root, h0)
	ct('===', h2.root, h0)
	ct('===', h1.root.a, 'a')
	ct('===', h2.root.a, 'a')
})

ct('element - event', function() {
	var tpl = el('h0').event('click', function(e) { e.target.textContent += 'a' }),
			cmp = tpl.create(),
			elm = cmp.node

	ct('===', elm.textContent, '')
	elm.dispatchEvent(new P.D.defaultView.Event('click'))
	ct('===', elm.textContent, 'a')
	elm.dispatchEvent(new P.D.defaultView.Event('click'))
	ct('===', elm.textContent, 'aa')
})

ct('element - immutable template', function() {
	var t0 = el('div'),
			t1 = P.template(t0.attr('id', 1).append(el('h1').append(1)).create().node),
			t2 = P.template(el('h2', 2).create().node),
			h0 = t0.attr('id', 0).append(el('h0').append(0)).create(),
			h1 = t1.create(),
			h2 = t2.attr('id', 2).create(),
			h3 = t0.attr('id', '3').append(el('h3').append(3)).create(),
			h4 = t0.attr('id', 4).append(el('h4').append(4)).create()

	ct('===', h0.node.childNodes.length, 1)
	ct('===', h1.node.childNodes.length, 1)
	ct('===', h2.node.childNodes.length, 1)
	ct('===', h3.node.childNodes.length, 1)
	ct('===', h4.node.childNodes.length, 1)

	ct('===', h0.node.id, '0')
	ct('===', h1.node.id, '1')
	ct('===', h2.node.id, '2')
	ct('===', h3.node.id, '3')
	ct('===', h4.node.id, '4')
})

ct('element - update', function() {
	var co = el('h0').append(
		P.text('a'),
		P.text('b').extra('update', function(v) { this.text(v.toUpperCase()) }),
		P.text('c').extra('update', function(v) { this.text(v.toUpperCase()); this.update = null })
	).create()
	ct('===', co.node.textContent, 'abc')

	co.update('d')
	ct('===', co.node.textContent, 'dDD')
	co.update('e')
	ct('===', co.node.textContent, 'eED')
})

ct('element - custom element', function() {
	var co = el('h0').append(
		el('h1').append(
			el('h2', 'x').call(
				function() {
					this.root.update = this.text.bind(this)
				}
			)
		)
	).create()
	ct('===', co.node.textContent, 'x')
	ct('===', co.node.firstChild.textContent, 'x')
	ct('===', co.node.firstChild.firstChild.textContent, 'x')

	co.update('Y')
	ct('===', co.node.textContent, 'Y')
	ct('===', co.node.firstChild.textContent, 'Y')
	ct('===', co.node.firstChild.firstChild.textContent, 'Y')
})
