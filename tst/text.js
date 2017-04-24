var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		X = require('../dist/index.js')

X.setDefaultView(jsdom().defaultView)

var text = X.createTextNode

ct('text - static', function() {
	ct('===', text('a').nodeType, 3)
	ct('===', text('ab').nodeValue, 'ab')
	ct('===', text('ab').parentNode, null)
})

ct('text - dynamic', function() {
	var lens = X.createLens(),
			t0 = text(lens.map(0)),
			t1 = text(lens.map(1))
	ct('===', t0.nodeValue, '')
	ct('===', t1.nodeValue, '')
	X.update(t0, ['a', 'b'])
	X.update(t1, ['a', 'b'])
	ct('===', t0.nodeValue, 'a')
	ct('===', t1.nodeValue, 'b')
	X.update(t0, ['c', 'd'])
	X.update(t1, ['c', 'd'])
	ct('===', t0.nodeValue, 'c')
	ct('===', t1.nodeValue, 'd')
})
