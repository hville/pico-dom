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

ct('element - state and store', function() {
	var h1 = {},
			h2 = {}
	var h0 = el('h0', el('h1', c => h1=c, el('h2', c=>h2=c)))
	.defaults({store: {}, state: {a:'a'}}).create()
	ct('===', h1.state, h0.state)
	ct('===', h2.state, h0.state)
	ct('===', h1.store, h0.store)
	ct('===', h2.store, h0.store)
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
