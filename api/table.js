var pico = require('../index'),
		icon = require('./icon')

var sharedContext = {
	focus: [],
	data: {},
	sort: []
}
var initContext = {
	init: function initTableContext(cfg) {
		this.tableContext = cfg ? Object.assign(sharedContext, cfg) : sharedContext
	}
}

//custom creators for shared scope
var li = pico.liCreator(initContext),
		co = pico.coCreator(initContext),
		el = pico.el
var thead = co('thead', {},
	co('tr', {},
		li('th', {
			edit: function() {
				var ctx = this.tableContext
				this.el.style.color = (this.k === ctx.focus[1]) ? 'blue' : 'black'
			}
		})
	)
)
var tfoot = co('tfoot', {},
	co('tr', {},
		li('th', {
			edit: function(v) {
				var ctx = this.tableContext
				this.el.style.color = (this.k === ctx.focus[1]) ? 'blue' : 'black'
				this.el.textContent = v.length
			}
		})
	)
)
var tbody = co('tbody', {},
	li('tr', {
		edit: function(row) {
			var ctx = this.tableContext
			this.el.style.color = (this.k === ctx.focus[0]) ? 'blue' : 'black'
			return ctx.sort[1].map(function(k) { return {k:k, v: row.v[k]} })
		}
	}, [
		co('td',
			el.svg('svg',
				el.svg('use[xlink:href="#icon-feather"]')
			)
		),
		li('td', {
			edit: function(v) {
				this.el.textContent = v
			}
		}),
		co('td', {
			edit: function(v) {
				this.el.textContent = v.length
			}
		})
	])
)
module.exports = co('div', {}, [
	icon,
	co('table', {
		edit: function(v) {
			var ctx = this.tableContext
			ctx.data = v.srt[0].map(function(k) { return {k:k, v:v.val[k]} })
			ctx.focus = v.sel
			ctx.sort = v.srt
			return ctx.data
		}
	}, [thead, tbody, tfoot])
])
