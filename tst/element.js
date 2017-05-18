var ct = require('cotest'),
		X = require('../dist/index.js'),
		// @ts-ignore
		JSDOM = require('jsdom').JSDOM

var win = (new JSDOM).window
X.setDocument(win.document)

var el = X.element

function toString(nodes) {
	var str = ''
	if (nodes) for (var i=0; i<nodes.length; ++i) str+=nodes[i].textContent
	return str
}

ct('element - static', function() {
	ct('===', el('p').create().node.nodeType, 1)
	ct('===', toString(el('p', 'ab').create().node.childNodes), 'ab')
	ct('===', el('p', p => p.prop('id', 'A')).create().node.id, 'A')
	ct('===', el('p', {attrs: {id: 'A'}}).create().node.id, 'A')
})

ct('element - mixed children', function() {
	ct('===', el('p', [0, el('p')], el('p'), [el('p')]).create().node.childNodes.length, 4)
	ct('===', el('p', el('p'), [], el('p'), [el('p'), 0]).create().node.childNodes.length, 4)
	ct('===', el('p', el('p'), null, 0, [el('p'), el('p')]).create().node.childNodes.length, 4)
})

ct('element - static, multiple mixed arguments', function() {
	var p = el('p', c => c.append(0), c => c.class('A'), 1, {props: {id: 'B'}}, 2).create().node
	ct('===', p.nodeType, 1)
	ct('===', p.firstChild.nodeValue, '0')
	ct('===', p.className, 'A')
	ct('===', p.id, 'B')
	ct('===', p.lastChild.nodeValue, '2')
	ct('===', p.textContent, '012')
})

ct('element - common', function() {
	var h1 = {},
			h2 = {}
	var h0 = el('h0', el('h1', c => h1=c, el('h2', c=>h2=c))).create({common: {a:'a'}})
	ct('===', h1.common, h0.common)
	ct('===', h2.common, h0.common)
	ct('===', h1.common.a, h0.common.a)
	ct('===', h2.common.a, h0.common.a)
})

ct('element - event', function() {
	var tpl = el('h0', {on: {click: function(e) { e.target.textContent += 'a' } }}),
			cmp = tpl.create(),
			elm = cmp.node

	ct('===', elm.textContent, '')
	elm.dispatchEvent(new win.Event('click'))
	ct('===', elm.textContent, 'a')
	elm.dispatchEvent(new win.Event('click'))
	ct('===', elm.textContent, 'aa')
})

ct('element - immutable template', function() {
	var t0 = el('div'),
			t1 = X.template(t0.config({attrs: {id: 1}, append: el('h1', 1)}).create().node),
			t2 = X.template(el('h2', 2).create().node),
			h0 = t0.config({attrs: {id: 0}, append: el('h0', 0)}).create(),
			h1 = t1.create(),
			h2 = t2.config({attrs: {id: 2}}).create(),
			h3 = t0.config({attr: ['id', '3'], append: el('h3', 3)}).create(),
			h4 = t0.config({attrs: {id: 4}, append: el('h4', 4)}).create()

	ct('===', t1.node.childNodes.length, 1)
	ct('===', t2.node.childNodes.length, 1)

	ct('===', t0.create().node.childNodes.length, 0)
	ct('===', h0.node.childNodes.length, 1)
	ct('===', h1.node.childNodes.length, 1)
	ct('===', h2.node.childNodes.length, 1)
	ct('===', h3.node.childNodes.length, 1)
	ct('===', h4.node.childNodes.length, 1)

	ct('===', t0.create().node.id, '')
	ct('===', h0.node.id, '0')
	ct('===', h1.node.id, '1')
	ct('===', h2.node.id, '2')
	ct('===', h3.node.id, '3')
	ct('===', h4.node.id, '4')
})
