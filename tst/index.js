/* eslint no-console: 0, no-loop-func: 0, no-invalid-this: 0 */
'use strict'
require('untap').pipe()
require('@private/dom-sim')

var tt = require('tt'),
		h = require('../src/index').htm,
		//s = require('../src/index').svg,
		c = require('../src/index').co,
		createStore = require('@private/mini-store')

/*tt('event tests', function(t) {
	var eventCb = new Event('captureB', {bubble: true})
	var eventCc = new Event('captureC', {bubble: false})
	var eventBb = new Event('bubbleB', {bubble: true})
	var eventBc = new Event('bubbleC', {bubble: false})
	function handler(evt) { console.log('***EVENT', evt.type) }
	window.addEventListener('captureC', handler, true) //YES
	window.addEventListener('bubbleB', handler, false) //FAIL
	window.addEventListener('captureB', handler, true) //YES
	window.addEventListener('bubbleC', handler, false) //FAIL
	//event.initEvent("click", null, null);
	document.body.dispatchEvent(eventCb)
	document.body.dispatchEvent(eventCc)
	document.body.dispatchEvent(eventBb)
	document.body.dispatchEvent(eventBc)
	t.end()
})*/
tt('dom el only', function(t) {
	var el0 = h('.ecl#eid')
	t.equal(el0.id, 'eid')
	t.equal(el0.tagName.toLowerCase(), 'div')
	t.notEqual(el0.className.indexOf('ecl'), -1, el0.className)

	var el1 = h('input.ecl', {id: 'eid'})
	t.equal(el1.id, 'eid')
	t.equal(el1.tagName.toLowerCase(), 'input')
	t.notEqual(el1.className.indexOf('ecl'), -1, el1.className)

	var el2 = h('input.ec0#eid.ec1')
	t.equal(el2.id, 'eid')
	t.notEqual(el2.className.indexOf('ec0'), -1, el2.className)
	t.notEqual(el2.className.indexOf('ec1'), -1, el2.className)

	t.end()
})

tt('children', function(t) {
	var el32 = h('#id32'),
			el31 = h('#id31'),
			el30 = h('#id30'),
			el22 = h('#id22'),
			el21 = h('#id21'),
			el20 = h('#id20', [el30, el31], el32),
			el12 = h('#id12'),
			el11 = h('#id11'),
			el10 = h('div', {id: 'id10'}, el20, [el21, el22]),
			el00 = h('#id00', el10, el11, el12)

	t.equal(el00.id, 'id00')
	t.equal(el00.childNodes.length, 3) //2
	t.equal(el00.firstChild.id, 'id10') //11

	t.equal(el10.id, 'id10')
	t.equal(el10.childNodes.length, 3)
	t.equal(el10.firstChild.id, 'id20')

	t.equal(el20.id, 'id20')
	t.equal(el20.childNodes.length, 3)
	t.equal(el20.firstChild.id, 'id30')

	t.end()
})

tt('store, events, children, view', function(t) {
	function inputView(val) { this.el.value = val }
	function inputHandler(evt) { console.log('EVENT ', evt.type); this.store.set(evt.target.value) }

	var rootStore = createStore({pth:''}, function() {}),
			store = rootStore.sub('pth')
	var inputCo = c(h('input'), {
		view: inputView,
		on: {input:inputHandler},
		onchange: inputHandler,
		store: store
	})
	console.log('REGISTERED EVENTS:', inputCo.on())
	var editableCellEl = h('td', inputCo)
	t.equal(editableCellEl.firstChild, inputCo.el)
	var editableCell = c(editableCellEl, {
		view: inputCo.view.bind(inputCo),
		store: inputCo.store
	})
	t.equal(editableCell.el.firstChild, inputCo.el)
	var editableRow = c(h('tr', editableCell), {
		view: function(v, o, s) { editableCell.view(v, o, s) },
		store: store
	})

	document.body.appendChild(editableRow.el)

	t.equal(editableCell.el.firstChild, inputCo.el)
	t.equal(editableRow.el.firstChild, editableCell.el)
	t.equal(document.body.firstChild, editableRow.el)

	editableRow.view('xxx')
	t.equal(inputCo.el.value, 'xxx')
	inputCo.el.dispatchEvent(new Event('input'))
	t.equal(store.get(), 'xxx')

	editableRow.view('yyy')
	t.equal(inputCo.el.value, 'yyy')
	inputCo.el.dispatchEvent(new Event('change'))
	t.equal(store.get(), 'yyy')

	store.set('zzz')
	editableRow.update()
	t.equal(inputCo.el.value, 'zzz')

	t.end()
})
