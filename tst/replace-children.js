var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		P = require('../dist/index.js')

var defaultView = P.setDefaultView(jsdom().defaultView),
		doc = defaultView.document,
		replaceChildren = P.replaceChildren

function text(v) {
	return doc.createTextNode(v)
}

ct('replaceChildren', function() {
	var p = doc.createElement('p')

	replaceChildren(p, [1,2,3,4,5].map(text))
	ct('===', p.textContent, '12345', 'insert into empty parent')

	replaceChildren(p, null, p.childNodes[0], p.childNodes[3])
	ct('===', p.textContent, '145', 'delete node in range')

	replaceChildren(p, [2,3].map(text), p.childNodes[0], p.childNodes[1])
	ct('===', p.textContent, '12345', 'insert within boundaries')

	replaceChildren(p, null, undefined, p.childNodes[3])
	ct('===', p.textContent, '45', 'delete all before (undefined "after")')

	replaceChildren(p, [1,2,3].map(text), undefined, p.childNodes[0])
	ct('===', p.textContent, '12345', 'insert all before (undefined "after")')

	replaceChildren(p, null, p.childNodes[2])
	ct('===', p.textContent, '123', 'delete all after (undefined "before")')

	replaceChildren(p, [4,5].map(text), p.childNodes[2])
	ct('===', p.textContent, '12345', 'insert all after (undefined "before")')

	replaceChildren(p, [6,7].map(text), p.lastChild, undefined)
	ct('===', p.textContent, '1234567', 'insert all after (undefined "before")')
})
