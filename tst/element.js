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
	var get = X.getter(),
			p0 = el('p', 0, attr('class', get.map('0')), child(1), prop('id', get.map('1')), 2),
			p1 = el('p', text(get.map(1)))
	X.update(p0, ['aa', 'bb'])
	ct('===', p0.className, 'aa')
	ct('===', p0.id, 'bb')
	ct('===', p0.textContent, '012')
	X.update(p1, ['aa', 'bb'])
	ct('===', p1.textContent, 'bb')
})

ct('element - dynamic - nested', function() {
	var get = X.getter(),
			p = el('p', 0, attr('class', get.map('0')), child(1), prop('id', get.map('1')), 2),
			d = el('div', p)
	X.update(d, ['aa', 'bb'])
	ct('===', p.className, 'aa')
	ct('===', p.id, 'bb')
	ct('===', p.textContent, '012')
})

//TODO event
