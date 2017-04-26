var JSDOM = require('jsdom').JSDOM,
		ct = require('cotest'),
		X = require('../dist/index.js')

X.setDocument((new JSDOM).window.document)

var el = X.createElement,
		getter = X.getter

ct('element - static', function() {
	ct('===', el('p').node.parentNode, null)
	ct('===', el('p').node.nodeType, 1)
	ct('===', el('p').addChild('ab').node.firstChild.nodeType, 3)
	ct('===', el('p').addChild('ab').node.textContent, 'ab')
	ct('===', el('p').setProp('id', 'A').node.id, 'A')
	ct('===', el('p').setAttr('id', 'A').node.id, 'A')
})

ct('element - static, multiple mixed arguments', function() {
	var p = el('p').addChild(0).setAttr('class', 'A').addChild(1).setProp('id', 'B').addChild(2).node
	ct('===', p.parentNode, null)
	ct('===', p.nodeType, 1)
	ct('===', p.firstChild.nodeValue, '0')
	ct('===', p.className, 'A')
	ct('===', p.id, 'B')
	ct('===', p.lastChild.nodeValue, '2')
	ct('===', p.textContent, '012')
})

ct('element - dynamic - self', function() {
	var p0 = el('p').addChild(0).setAttr('class', getter('0')).addChild(1).setProp('id', getter(1)).addChild(2).node,
			p1 = el('p').setText(getter(1)).node
	X.update(p0, ['aa', 'bb'])
	ct('===', p0.className, 'aa')
	ct('===', p0.id, 'bb')
	ct('===', p0.textContent, '012')
	X.update(p1, ['aa', 'bb'])
	ct('===', p1.textContent, 'bb')
})

//TODO event
