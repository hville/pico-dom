var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		X = require('../dist/index.js')

X.setDefaultView(jsdom().defaultView)

var el = X.createElement,
		attr = X.setAttribute,
		prop = X.setProperty,
		child = X.addChild,
		text = X.setText

ct('element - static', function() {
	ct('===', el('p').parentNode, null)
	ct('===', el('p').nodeType, 1)
	ct('===', el('p', 'ab').firstChild.nodeType, 3)
	ct('===', el('p', 'ab').textContent, 'ab')
	ct('===', el('p', prop('id', 'A')).id, 'A')
	ct('===', el('p', attr('id', 'A')).id, 'A')
	var p = el('p', 0, attr('class', 'A'), 1, prop('id', 'B'), 2)
	ct('===', p.parentNode, null)
	ct('===', p.nodeType, 1)
	ct('===', el('p', 'ab').firstChild.nodeType, 3)
	ct('===', el('p', 'ab').textContent, 'ab')
	ct('===', el('p', prop('id', 'A')).id, 'A')
	ct('===', el('p', attr('id', 'A')).id, 'A')
})

ct('element - static, multiple mixed arguments', function() {
	var p = el('p', 0, attr('class', 'A'), child(1), prop('id', 'B'), 2)
	ct('===', p.parentNode, null)
	ct('===', p.nodeType, 1)
	ct('===', p.firstChild.nodeValue, '0')
	ct('===', p.className, 'A')
	ct('===', p.id, 'B')
	ct('===', p.lastChild.nodeValue, '2')
	ct('===', p.textContent, '012')
})

ct('element - dynamic - self', function() {
	var lens = X.createLens(),
			p0 = el('p', 0, attr('class', lens.map('0')), child(1), prop('id', lens.map('1')), 2),
			p1 = el('p', text(lens.map(1)))
	X.updateNode(p0, ['aa', 'bb'])
	ct('===', p0.className, 'aa')
	ct('===', p0.id, 'bb')
	ct('===', p0.textContent, '012')
	X.updateNode(p1, ['aa', 'bb'])
	ct('===', p1.textContent, 'bb')
})

ct('element - dynamic - nested', function() {
	var lens = X.createLens(),
			p = el('p', 0, attr('class', lens.map('0')), child(1), prop('id', lens.map('1')), 2),
			d = el('div', p)
	X.updateNode(d, ['aa', 'bb'])
	ct('===', p.className, 'aa')
	ct('===', p.id, 'bb')
	ct('===', p.textContent, '012')
})

//TODO event
