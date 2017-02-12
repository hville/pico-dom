var pico = require('../index'),
		jsdom = require('jsdom'),
		ct = require('cotest'),
		htm = require('../src/elem/elem')

var document = jsdom.jsdom(),
		DOM = document.defaultView,
		svg = htm.svg

pico.global.document = document

ct('api', function() {
	ct('===', typeof htm, 'function')
	ct('===', typeof svg, 'function')
})
ct('html', function() {
	var el = htm('div')()
	ct('===', el instanceof DOM.Node, true)
	ct('===', typeof el, 'object')
	ct('===', el.nodeName.toLowerCase(), 'div')
})
ct('svg', function() {
	var el = svg('svg')()
	ct('===', el.nodeName.toLowerCase(), 'svg')
	ct('!!', el instanceof DOM.Node)
})
ct('svg attributes', function() {
	var el = svg('svg', svg('path[d=mypath]'))()
	ct('===', el.nodeName.toLowerCase(), 'svg')
	ct('!!', el instanceof DOM.Node)
	ct('===', el.childNodes.length, 1)
	ct('===', el.firstChild instanceof DOM.Node, true)
	//ct('===', el.firstChild.nodeName, 'path')
})
ct('svg style attributes', function() {
	var el = svg('svg[style="display: none;"]')()
	ct('===', el.hasAttribute('style'), true)
	ct('===', el.getAttribute('style'), 'display:none;')
})
ct('html text nodes', function() {
	var el = htm('div', 'one', [2, 'three'])()
	ct('===', el.childNodes.length, 3)
	ct('===', el.children.length, 0)
})
ct('html text content', function() {
	var el = htm('div', [2])()
	ct('===', el.textContent, '2')
	ct('===', el.children.length, 0)
})
ct('html falsy children', function() {
	var el = htm('div', '', 0, null, [undefined, 0])()
	ct('===', el.childNodes.length, 2)
	ct('===', el.childNodes[1].textContent, '0')
})
ct('mixed nested namespace', function() {
	var el = htm('div', svg('svg'), htm('p', 'text'))()
	ct('===', el.childNodes.length, 2)
	ct('===', el.children.length, 2)
})
ct('selectors', function() {
	var el = htm('div.c1#i1[style="color:blue"].c2')()
	ct('===', el.nodeName, 'DIV')
	ct('===', el.id, 'i1')
	ct('===', el.className, 'c1 c2')
	ct('===', el.style.color, 'blue')
	ct('===', el.getAttribute('style'), 'color:blue')
})
ct('decorators', function() {
	var handler = function(){},
			el = htm('div', {
				style: {color: 'blue'},
				props: {className: 'c1 c2', id: 'i1', onclick: handler}
			})()
	ct('===', el.nodeName, 'DIV')
	ct('===', el.id, 'i1')
	ct('===', el.className, 'c1 c2')
	ct('===', el.style.color, 'blue')
	ct('===', el.getAttribute('style'), 'color:blue;')
})
ct('element namespace', function() {
	var el0 = svg('circle')(),
			el1 = htm('svg:circle')(),
			el2 = htm('circle[xmlns="http://www.w3.org/2000/svg"]')()
	ct('===', el0.namespaceURI, 'http://www.w3.org/2000/svg')
	ct('===', el1.namespaceURI, 'http://www.w3.org/2000/svg')
	ct('===', el2.namespaceURI, 'http://www.w3.org/2000/svg')
})
ct('styles', function() { //font-weight: bold; color: red; font-size:150%;
	var el0 = svg('circle[style=font-size:150%;color:blue;]')(),
			el1 = htm('svg:circle[style=font-size:150%;color:blue]')(),
			el2 = svg('circle', {style: {'font-size':'150%', color:'blue'}})(),
			el3 = htm('div', {style: {'font-size':'150%', color:'blue'}})()
	ct('===', el0.getAttribute('style'), 'font-size:150%;color:blue;')
	ct('===', el1.getAttribute('style'), 'font-size:150%;color:blue')
	ct('===', el2.getAttribute('style'), 'font-size:150%;color:blue;')
	ct('===', el3.getAttribute('style'), 'font-size:150%;color:blue;')
})
ct('attribute namespace', function() {
	var el0 = svg('circle[xmlns:xlink="http://www.w3.org/1999/xlink"]')(),
			el1 = svg('circle[xmlns:xlink="http://www.w3.org/1999/xlink"]')(),
			el2 = htm('circle', {attrs: {'xmlns:xlink':'http://www.w3.org/2000/svg'}})()
	ct('===', el0.hasAttributeNS('xmlns','xlink'), true)
	ct('===', el1.hasAttributeNS('xmlns','xlink'), true)
	ct('===', el2.hasAttributeNS('xmlns','xlink'), true)
})
ct('factory options', function() {
	var fac = htm('p'),
			el0 = fac({props:{textContent: 'y'}}),
			el1 = fac({props:{textContent: 'z'}})
	ct('===', el0.textContent, 'y')
	ct('===', el1.textContent, 'z')
})
ct('forced properties and attributes', function() {
	var ela = htm('div')({
		attributes:{class: 'c', tabIndex: 2}
	})
	var elp = htm('div')({
		properties:{className: 'c', tabIndex: 2}
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
