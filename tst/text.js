var JSDOM = require('jsdom').JSDOM,
		ct = require('cotest'),
		P = require('../dist/index.js')

P.setDocument((new JSDOM).window.document)

var text = P.createTextNode

ct('text - static', function() {
	ct('===', text('a').node.nodeType, 3)
	ct('===', text('ab').node.nodeValue, 'ab')
	ct('===', text('ab').node.parentNode, null)
})

ct('text - dynamic', function() {
	var get = P.getter(),
			t0 = text(get.map(0)).node,
			t1 = text(get.map(1)).node
	ct('===', t0.nodeValue, '')
	ct('===', t1.nodeValue, '')
	P.update(t0, ['a', 'b'])
	P.update(t1, ['a', 'b'])
	ct('===', t0.nodeValue, 'a')
	ct('===', t1.nodeValue, 'b')
	P.update(t0, ['c', 'd'])
	P.update(t1, ['c', 'd'])
	ct('===', t0.nodeValue, 'c')
	ct('===', t1.nodeValue, 'd')
})
