var ct = require('cotest'),
		P = require('../dist/index.js')

if (!P.D) {
	// @ts-ignore
	var JSDOM = require('jsdom').JSDOM //eslint-disable-line global-require
	var win = (new JSDOM).window
	P.setDocument(win.document)
}


var el = P.element,
		list = P.list,
		text = P.text

function toString(nodes) {
	var str = ''
	if (nodes) for (var i=0; i<nodes.length; ++i) str+=nodes[i].textContent
	return str
}

ct('list static', function() {
	var listChildTemplate = el('p', text('x')),
			listTemplate = list(listChildTemplate),
			mainTemplate = el('div', listTemplate),
			co = mainTemplate.create(),
			elem = co.node
	ct('===', toString(elem.childNodes), '^$')

	co.update([1,2,3])
	ct('===', toString(elem.childNodes), '^123$')

	co.update([4,3,1,2])
	ct('===', toString(elem.childNodes), '^4312$')

	co.update([])
	ct('===', toString(elem.childNodes), '^$')

	co.update([1,5,3])
	ct('===', toString(elem.childNodes), '^153$')
})

ct('list stacked', function() {
	var co = el('div',
		list(text('')),
		list(text('')),
		list(text(''))
	).create()
	var elem = co.node
	ct('===', toString(elem.childNodes), '^$^$^$')

	co.update([1,2,3])
	ct('===', toString(elem.childNodes), '^123$^123$^123$')

	co.update([4,3,1,2])
	ct('===', toString(elem.childNodes), '^4312$^4312$^4312$')

	co.update([])
	ct('===', toString(elem.childNodes), '^$^$^$')

	co.update([1,5,3])
	ct('===', toString(elem.childNodes), '^153$^153$^153$')
})

ct('list stacked and grouped', function() {
	var co = el('div', list([
		list(text('')),
		list(text('x')),
		list(text('y'))
	])).create()
	var elem = co.node

	co.update([1,2,3])
	ct('===', toString(elem.childNodes), '^^123$^123$^123$$')

	co.update([4,3,1,2])
	ct('===', toString(elem.childNodes), '^^4312$^4312$^4312$$')

	co.update([])
	ct('===', toString(elem.childNodes), '^^$^$^$$')

	co.update([1,5,3])
	ct('===', toString(elem.childNodes), '^^153$^153$^153$$')
})

ct('list nested', function() {
	var co = el('div',
		list(
			list(
				el('h1',
					text('')
				)
			)
		)
	).create()
	var elem = co.node

	ct('===', toString(elem.childNodes), '^$')

	co.update([[1,2],[3,4]])
	ct('===', toString(elem.childNodes), '^^12$^34$$')

	co.update([[1],[],[2,3,4]])
	ct('===', toString(elem.childNodes), '^^1$^$^234$$')

	co.update([[1,2,3,4]])
	ct('===', toString(elem.childNodes), '^^1234$$')
})

ct('list keyed', function() {
	var co = el('h1',
		list(
			text('x').extra('update', function(v) { this.text(v.v); this.update = null })
		).extra('getKey', v => v.k)
	).create()
	var elem = co.node

	ct('===', toString(elem.childNodes), '^$')

	co.update([{k: 1, v:1}, {k: 'b', v:'b'}])
	ct('===', toString(elem.childNodes), '^1b$')

	co.update([{ k: 'b', v: 'bb' }, { k: 1, v: 11 }])
	ct('===', toString(elem.childNodes), '^b1$', 'must use existing nodes')

	co.update([{k: 'c', v:'c'}])
	ct('===', toString(elem.childNodes), '^c$')

	co.update([{ k: 'b', v: 'bbb' }, { k: 'c', v: 'ccc' }, { k: 1, v: 111 }])
	ct('===', toString(elem.childNodes), '^bbbc111$', 're-creates removed nodes')
})

ct('list select', function() {
	var co = el('h1',
		list({
			a: text('').extra('update', function(v) { this.text('a'+v) }),
			b: text('').extra('update', function(v) { this.text('b'+v) })
		}).extra('select', v => v)
	).create()
	var elem = co.node

	ct('===', toString(elem.childNodes), '^$')

	co.update('a')
	ct('===', toString(elem.childNodes), '^aa$')

	co.update('b')
	ct('===', toString(elem.childNodes), '^bb$')

	co.update('c')
	ct('===', toString(elem.childNodes), '^$')
})
