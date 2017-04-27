var JSDOM = require('jsdom').JSDOM,
		ct = require('cotest'),
		P = require('../dist/index.js')

P.setDocument((new JSDOM).window.document)

var grp = P.createGroup,
		elm = P.createElement

function concatData(e) {
	for (var i=0, str=''; i<e.childNodes.length; ++i) str+=e.childNodes.item(i).textContent
	return str
}

ct('group - static', function() {
	var g0 = grp(elm('p').setText('a')),
			p0 = elm('div').addChild(g0)
	ct('===', g0.nodes.length, 1)

	ct('===', concatData(p0.node), '^a$')

	g0.nodes = [elm('p').setText('b'), elm('p').setText('c')]
	ct('===', concatData(p0.node), '^bc$')
})

ct('group - dynamic', function() {
	var eA = elm('p').setText('A'),
			eB = elm('p').setText('B'),
			g0 = grp(P.getter(function(v) { return v === 'a' ? eA : v==='b' ? eB : null })),
			p0 = elm('div').addChild(g0)
	ct('===', g0.nodes.length, 0)
	//ct('===', concatData(p0.node), '^$')

	//P.update(p0, 'a')
	//ct('===', concatData(p0.node), '^A$')
})

