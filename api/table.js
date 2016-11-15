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
	},
	dataKey: 'k'
}

//custom creators for shared scope
var li = pico.chain(pico.List, initContext),
		co = pico.chain(pico.Component, initContext),
		el = pico.el
var thead = co('thead', {},
	co('tr', {
		edit: function(v) {
			return this.tableContext.sort[1].map(function(k) {return {k:k, v:v}})
		}
	},[
		el('th', '>'),
		li('th', {
			edit: function(v, i) {
				var ctx = this.tableContext
				this.el.style.color = (this.key === ctx.focus[1]) ? 'blue' : 'black'//TODO : allblack!
				console.log('TH', v, i, this.key)
				this.el.textContent = i
			}
		})
	])
)
var tfoot = co('tfoot', {},
	co('tr', {}, [
		el('th', '>'),
		li('th', {
			edit: function(v, i) {
				var ctx = this.tableContext
				this.el.style.color = (this.key === ctx.focus[0]) ? 'blue' : 'black'
				this.el.textContent = i
			}
		})
	])
)
var tbody = co('tbody', {},
	li('tr', {
		edit: function(row) {
			var ctx = this.tableContext
			this.el.style.color = (this.key === ctx.focus[0]) ? 'blue' : 'black'

			return ctx.sort[1].map(function(k) { return {k:k, v: row.v[k]} })
		}
	}, [
		co('td',
			el.svg('svg',
				el.svg('use[xlink:href="#icon-feather"]') //TODO display: none gets copied!
			)
		),
		li('td', {
			edit: function(col) {
				//console.log('tdEdit', col, idx)
				this.el.textContent = col.v
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
