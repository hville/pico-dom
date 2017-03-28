var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		el = require('../src/el'),
		ENV = require('../src/env')

ENV.window = jsdom().defaultView

var handler = function(){}

ct('el-api', function() {
	ct('===', typeof el, 'function')
	ct('===', typeof el.svg, 'function')
})
ct('el-html', function() {
	var elm = el('div')
	ct('===', elm instanceof ENV.Node, true)
	ct('===', typeof elm, 'object')
	ct('===', elm.nodeName.toLowerCase(), 'div')
})
ct('el-svg', function() {
	var elm = el.svg('svg')
	ct('===', elm.nodeName.toLowerCase(), 'svg')
	ct('!!', elm instanceof ENV.Node)
})
ct('el-svg attributes', function() {
	var elm = el.svg('svg', el.svg('path[d=mypath]'))
	ct('===', elm.nodeName.toLowerCase(), 'svg')
	ct('!!', elm instanceof ENV.Node)
	ct('===', elm.childNodes.length, 1)
	ct('===', elm.firstChild instanceof ENV.Node, true)
})
ct('el-svg style attributes', function() {
	var elm = el.svg('svg[style="display: none;"]')
	ct('===', elm.hasAttribute('style'), true)
	ct('===', elm.getAttribute('style'), 'display: none;')
})
ct('el-html text nodes', function() {
	var elm = el('div', 'one', [2, 'three'])
	ct('===', elm.childNodes.length, 3)
	ct('===', elm.children.length, 0)
})
ct('el-html text content', function() {
	var elm = el('div', [2])
	ct('===', elm.textContent, '2')
	ct('===', elm.children.length, 0)
})
ct('el-html falsy children', function() {
	var elm = el('div', '', 0, null, [undefined, 0])
	ct('===', elm.childNodes.length, 2)
	ct('===', elm.childNodes[1].textContent, '0')
})
ct('el-mixed nested namespace', function() {
	var elm = el('div', el.svg('svg'), el('p', 'text'))
	ct('===', elm.childNodes.length, 2)
	ct('===', elm.children.length, 2)
})
ct('el-selectors', function() {
	var elm = el('div.c1#i1[style="color:blue"].c2')
	ct('===', elm.nodeName, 'DIV')
	ct('===', elm.id, 'i1')
	ct('===', elm.className, 'c1 c2')
	ct('===', elm.style.color, 'blue')
	ct('===', elm.getAttribute('style').replace(/\s|\;/g, ''), 'color:blue')
})
ct('el-decorators-props', function() {
	var elm = el('div', {props: {
		className: 'c1 c2',
		class: 'c3',
		id: 'i1',
		onclick: handler
	}})
	ct('===', elm.id, 'i1')
	ct('===', elm.className, 'c1 c2')
	ct('===', elm.onclick, handler)
})
ct('el-decorators-attrs', function() {
	var elm = el('div', {attrs: {
		class: 'c1 c2',
		className: 'c3',
		id: 'i1',
		onclick: handler
	}})
	ct('===', elm.id, 'i1')
	ct('===', elm.className, 'c1 c2')
})
ct('el-element namespace', function() {
	var el0 = el.svg('circle'),
			el1 = el('svg:circle'),
			el2 = el('circle[xmlns="http://www.w3.org/2000/svg"]')
	ct('===', el0.namespaceURI, 'http://www.w3.org/2000/svg')
	ct('===', el1.namespaceURI, 'http://www.w3.org/2000/svg')
	ct('===', el2.namespaceURI, 'http://www.w3.org/2000/svg')
})
ct('el-styles', function() { //font-weight: bold; color: red; font-size:150%;
	var el0 = el.svg('circle[style=font-size:150%;color:blue;]'),
			el1 = el('svg:circle[style=font-size:150%;color:blue]'),
			el2 = el.svg('circle', {attrs: {style: 'font-size:150%; color:blue'}}),
			el3 = el('div', {attrs: {style: 'font-size:150%; color:blue'}})
	ct('===', el0.getAttribute('style').replace(/\s/g, ''), 'font-size:150%;color:blue;')
	ct('===', el1.getAttribute('style').replace(/\s/g, ''), 'font-size:150%;color:blue')
	ct('===', el2.getAttribute('style').replace(/\s/g, ''), 'font-size:150%;color:blue')
	ct('===', el3.getAttribute('style').replace(/\s/g, ''), 'font-size:150%;color:blue')
})
ct.skip('el-attribute namespace, ie: xmlns:xlink', function() {
	var el0 = el.svg('circle[xmlns:xlink="http://www.w3.org/1999/xlink"]'),
			el1 = el.svg('circle[xmlns:xlink="http://www.w3.org/1999/xlink"]'),
			el2 = el('circle', {attrs: {'xmlns:xlink':'http://www.w3.org/2000/svg'}})
	ct('===', el0.hasAttributeNS('xmlns','xlink'), true)
	ct('===', el1.hasAttributeNS('xmlns','xlink'), true)
	ct('===', el2.hasAttributeNS('xmlns','xlink'), true)
})
ct('el-re-decorate', function() {
	var elm = el('p'),
			el0 = el(elm, {props:{className: 'y'}})
	ct('===', elm, el0)
	ct('===', el0.className, 'y')
	var el1 = el(el0, {props: {className: 'z'}})
	ct('===', el0, el1)
	ct('===', el1.className, 'z')
})
ct('el-forced properties and attributes', function() {
	var ela = el(el('div'), {
		attrs:{class: 'c', tabIndex: 2}
	})
	var elp = el(el('div'), {
		props:{className: 'c', tabIndex: 2}
	})
	ct('===', ela.tabIndex, 2)
	ct('===', elp.tabIndex, 2)
	ct('===', ela.getAttribute('tabIndex'), '2')
	ct('===', elp.getAttribute('tabIndex'), '2')
	ct('===', ela.className, 'c')
	ct('===', elp.className, 'c')
	ct('===', ela.getAttribute('class'), 'c')
	ct('===', elp.getAttribute('class'), 'c')
})
