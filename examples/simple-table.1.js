import {element as el, list} from '../module'
import {Store} from './Store' // any user store will do
import {ic_remove, ic_add} from './icons'

var i = 0,
		j = 0

var tableTemplate = el('table',
	el('tbody',
		list(
			el('tr', {
				class: 'abc',
				oncreate: function() { i = this.key }
			},
				el('td', { // title column
					oncreate: function() { this.i = i },
					on: {click: function() { this.root.store.delRow(this.i)}}
				},
					ic_remove
				),
				list( // data columns
					el('td',
						function() { j = this.key },
						el('input', {
							oncreate: function() { this.i = i; this.j = j },
							update: function(val) { this.node.value = val },
							on: {change: function() { this.root.store.set(this.node.value, [this.i, this.j]) } }
						})
					)
				)
			)
		),
		el('tr',
			el('td', {
				on: {click: function() { this.common.store.addRow() } }
			},
				ic_add
			)
		)
	)
) //750

var store = new Store([]),
		table = tableTemplate.create({common: {store: store}}).moveTo(document.body)

store.onchange = function() { table.update( store.get() ) }
store.set([['Jane', 'Roe'], ['John', 'Doe']])

store.addRow = function() {
	store.set(['',''], store.get().length)
}
store.delRow = function(idx) {
	var data = store.get().slice()
	data.splice(idx,1)
	store.set(data)
}

