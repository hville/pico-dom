var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		P = require('../dist/index.js')

P.setDefaultView(jsdom().defaultView)

var li = P.createList,
		//co = P.createComponent,
		update = P.updateNode,
		el = P.createElement,
		setText = P.setText

function concatData(e) {
	for (var i=0, str=''; i<e.childNodes.length; ++i) str+=e.childNodes.item(i).textContent
	return str
}
/*function logTree(node, pre, more) {
	var head = (pre||'') + '    '
	console.log(head,node.nodeType, node.nodeName, node.nodeValue, node.childNodes.length)
	var child = node.firstChild
	while (child) { logTree(child, head, true); child=child.nextSibling}
	if (!more) console.log()
}*/
ct('list static-element', function() {
	var l0 = li(el('p', 'x'))
	var elem = el('div', l0)

	update(elem, [1,2,3])
	ct('===', concatData(elem), '^xxx$')//3

	update(elem, [4,3,1,2])
	ct('===', concatData(elem), '^xxxx$')//2

	update(elem, [1,5,3])
	ct('===', concatData(elem), '^xxx$')//3
})
ct('list-simple', function() {
	var lens = P.createLens()
	var l0 = li(el('p', P.setText(lens)))
	var elem = el('div', l0)

	update(elem, [1,2,3])
	ct('===', elem.childNodes.length, 5)
	ct('===', concatData(elem), '^123$')//3
	update(elem, [4,3,1,2])
	ct('===', concatData(elem), '^4312$')//2
	update(elem, [1,5,3])
	ct('===', concatData(elem), '^153$')//3
})
ct('list-stacked', function() {
	var lens = P.createLens()
	var elem = el('div',
		li(el('h0', setText(lens))),
		li(el('h1', setText(lens))),
		li(el('h2', setText(lens)))
	)
	ct('===', concatData(elem), '^$^$^$')

	update(elem, [1,2,3])
	ct('===', concatData(elem), '^123$^123$^123$')
})
ct('list-complex', function() {
	var lens = P.createLens()
	//list update through parent update
	var liFac = li(
		el('td',
			P.setText(lens.map('v')),
			P.setProperty('', lens.map(function(v,i) {return i}))
		),
		'k'
	)
	var coEl = el('tr', liFac)
	update(coEl, [{k:'one', v:'one'}, {k:'two', v:'two'}, {k:'twe', v:'twe'}], 0)
	ct('===', concatData(coEl), '^onetwotwe$')
})
ct('sequence in nested lists', function() {
	var lens = P.createLens()
	var matEl = el('div',
		li(el('p',
			li(el('span',
				P.setText(lens.map()),
				P.setProperty('', lens.map(function(v,i) {return i}))
			))
		))
	)
	update(matEl, [[11,12,13],[21,22,23],[31,32,33]])
	ct('===', matEl.children.length, 3)
	ct('===', matEl.children[0].children.length, 3)
	ct('===', matEl.children[1].children.length, 3)
	ct('===', matEl.children[2].children.length, 3)
})
