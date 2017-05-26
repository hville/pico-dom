var ct = require('cotest'),
		P = require('../dist/index.js')

if (!P.D) {
	// @ts-ignore
	var JSDOM = require('jsdom').JSDOM //eslint-disable-line global-require
	var win = (new JSDOM).window
	P.setDocument(win.document)
}

var el = P.element,
		find = P.find


ct('find', function() {
	var h = {},
			h0 = {},
			h01 = {},
			h10 = {}
	el('h0').call(function() {h = this}).append(
		'H',
		el('h1', function() {h0 = this},
			'H0',
			el('h2', 'H00'),
			el('h2', 'H01', function() {h01 = this})
		),
		el('h1',
			'H1',
			el('h2', 'H10', function() {h10 = this}),
			el('h2', 'H11')
		)
	).create()

	ct('===', find(h), h)
	ct('===', find(h.node), h)
	ct('===', find(h.node.firstChild), h0)

	ct('===', find(h, c=>c.node.textContent === 'H10'), h10)
	ct('===', find(h, c=>c.node.textContent === 'H10', h10), h10)
	ct('===', find(h, c=>c.node.textContent === 'H10', h01), null)
})
