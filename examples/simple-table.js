import {element as el, list} from '../module'
import {Store} from './Store' // any user store will do
import {ic_remove, ic_add} from './icons'


var tableTemplate = el('table',
	el('tbody',
		list(
			el('tr',
				{class: 'abc'},
				function(tr) { tr.common.i = tr.key },
				el('td', ic_remove, {
					on: {click: function() { this.common.store.delRow(this.common.i)}}
				}), // title column
				list( // data columns
					el('td',
						function(td) { td.common.j = td.key },
						el('input',
							function(c) { c.i = c.common.i; c.j = c.common.j },
							{
								update: function(val) { this.node.value = val },
								on: {
									change: function() { this.common.store.set(this.node.value, [this.i, this.j]) }
								}
							}
						)
					)
				)
			)
		),
		el('tr',
			el('td', ic_add, {
				on: {
					click: function() { this.common.store.addRow() }
				}
			})
		)
	)
)

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

