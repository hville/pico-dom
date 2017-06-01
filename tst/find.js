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
			h1 = {},
			h12 = {},
			h21 = {}
	el('h1').call(function() {h = this}).append(
		'H',
		el('h2', function() {h1 = this},
			'H1',
			el('h3', 'H11'),
			el('h3', 'H12', function() {h12 = this})
		),
		el('h2',
			'H2',
			el('h3', 'H21', function() {h21 = this}),
			el('h3', 'H11')
		)
	).create()

	ct('===', find(h), h)
	ct('===', find(h.node), h)
	ct('===', find(h.node.firstChild), h1)

	ct('===', find(h, c=>c.node.textContent === 'H21'), h21)
	ct('===', find(h, c=>c.node.textContent === 'H21', h21), h21)
	ct('===', find(h, c=>c.node.textContent === 'H21', h12), null)
})
