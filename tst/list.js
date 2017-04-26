var JSDOM = require('jsdom').JSDOM,
		ct = require('cotest'),
		P = require('../dist/index.js')

P.setDocument((new JSDOM).window.document)

var li = P.createList,
		//co = P.createComponent,
		update = P.update,
		el = P.createElement

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
	var l0 = li(el('p').setText('x'))
	ct('===', l0.factory().node.tagName, 'P')
	ct('===', Object.keys(l0.update([1,2]).mapKC).length, 2)
	var co = el('div').addChild(l0),
			elem = co.node
	ct('===', concatData(elem), '^xx$')

	co.update = function(v) { l0.update(v) }
	update(co, [1,2,3])

	ct('===', concatData(elem), '^xxx$')//3

	update(co, [4,3,1,2])
	ct('===', concatData(elem), '^xxxx$')//2

	update(co, [1,5,3])
	ct('===', concatData(elem), '^xxx$')//3
})
ct('list-simple', function() {
	var getter = P.getter()
	var l0 = li(el('p').setText(getter))
	var co = el('div').addChild(l0),
			elem = co.node
	co.update = function(v) { this.updateChildren(v) }

	update(elem, [1,2,3])
	ct('===', elem.childNodes.length, 5)
	ct('===', concatData(elem), '^123$')//3
	co.update([4,3,1,2])
	ct('===', concatData(elem), '^4312$')//2
	update(elem, [1,5,3])
	ct('===', concatData(elem), '^153$')//3
})
ct('list-stacked', function() {
	var getter = P.getter()
	var co = el('div').addChild([
		li(el('h0').setText(getter)),
		li(el('h1').setText(getter)),
		li(el('h2').setText(getter))
	])
	var elem = co.node
	co.update = function(v) { this.updateChildren(v) }
	ct('===', concatData(elem), '^$^$^$')

	update(elem, [1,2,3])
	ct('===', concatData(elem), '^123$^123$^123$')
})
ct('list-complex', function() {
	var getter = P.getter()
	//list update through parent update
	var c = el('td')
		.setText(getter.map('v'))
		.setProp('', getter.map(function(v,i) {return i}))
	var liFac = li(c,'k')
	var co = el('tr').addChild(liFac),
			coEl = co.node
	co.update = co.updateChildren
	update(coEl, [{k:'one', v:'one'}, {k:'two', v:'two'}, {k:'twe', v:'twe'}], 0)
	ct('===', concatData(coEl), '^onetwotwe$')
})

ct('sequence in nested lists', function() {
	var getter = P.getter()
	var co1 = el('p').addChild(
		li(
			el('span')
				.setText(getter.map())
				.setProp('', getter.map(function(v,i) {return i}))
		)
	)
	ct('===', co1.node.childNodes.length, 2)
	co1.update = function(v,k,o) { this.updateSelf(v,k,o).updateChildren(v,k,o) }

	var matC = el('div').addChild(li(co1)),
			matN = matC.node
	ct('===', matC.node.childNodes.length, 2)
	matC.updateChildren([[11,12],[21,22]])
	matC.update = matC.updateChildren
	update(matN, [[11,12,13],[21,22,23],[31,32,33]])
	ct('===', matN.children.length, 3)
	//ct('===', matN.children[0].children.length, 3)
	//ct('===', matN.children[1].children.length, 3)
	//ct('===', matN.children[2].children.length, 3)
})
