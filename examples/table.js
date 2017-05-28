import {D, element as el, list} from '../module'
import {Store} from './Store' // any user store will do
import {ic_remove, ic_add} from './icons'

var store = new Store([]),
		i = 0,
		j = 0

var table = el('table',
	el('caption', {class: 'f4'}, 'table example with...'),
	el('tbody',
		list(
			el('tr',
				function() { i = this.key },
				el('td', //leading column with icon
					function() { this.i = i },
					{ events: { click: function() { this.root.store.delRow(this.i) } } },
					ic_remove
				),
				list( // data columns
					el('td',
						function() { j = this.key },
						el('input',
							function() {
								this.i = i; this.j = j
								this.update = function(v) { this.node.value = v }
								this.event('change', function() {
									this.root.store.set(this.node.value, [this.i, this.j])
								})
							}
						)
					)
				)
			)
		),
		el('tr',
			el('td',
				{ events: {click: function() { this.root.store.addRow() } } },
				ic_add
			)
		)
	)
).create()
.extra('store', store)
.moveTo(D.body)

store.onchange = function() { table.update( store.get() ) }
store.set([
	['icons', 'SVG icons'],
	['keyed', 'keyed list'],
	['store', 'data flow'],
	['event', 'event listeners']
])

store.addRow = function() {
	store.set(['',''], store.get().length)
}
store.delRow = function(idx) {
	var data = store.get().slice()
	data.splice(idx,1)
	store.set(data)
}

