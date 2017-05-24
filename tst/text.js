var ct = require('cotest'),
		P = require('../dist/index.js'),
		// @ts-ignore
		JSDOM = require('jsdom').JSDOM


P.setDocument((new JSDOM).window.document)

var text = P.text

ct('text - static', function() {
	ct('===', text('a').create().node.nodeType, 3)
	ct('===', text('ab').create().node.nodeValue, 'ab')
	ct('===', text('ab').create().node.parentNode, null)
})

ct('text - dynamic', function() {
	var co = text('abc').set('update', function(v) { this.text(v+v) }).create()
	ct('===', co.node.nodeValue, 'abc')
	co.update('def')
	ct('===', co.node.nodeValue, 'defdef')
})
