var pico = require('../index'),
		icon = require('./icon')

var sharedContext = {
	focus: [],
	data: {},
	sort: []
}
var initContext = {
	init: function initTableContext() {
		this.tableContext = sharedContext
	},
	dataKey: 'k'
}
function editTable(v) {
	var ctx = this.tableContext
	ctx.data = v.srt[0].map(function(k) { return {k:k, v:v.val[k]} })
	ctx.focus = v.sel
	ctx.sort = v.srt
	ctx.cols = v.srt[1].map(function(k) {return {k:k, v:k.toUpperCase()}})
	return ctx.data
}

//custom creators for shared scope
var li = pico.Li(initContext),
		co = pico.Co(initContext),
		el = pico.el
var thead = co('thead',
	co('tr', {
		ondata: function() {
			return this.tableContext.cols
		}
	},[
		el('th', '>'),
		li('th', {
			ondata: function(v, i) {
				var ctx = this.tableContext
				this.el.style.color = (this.key === ctx.focus[1]) ? 'blue' : 'black'
				this.el.textContent = i
			}
		}),
		el('th', 'V')
	])
)
var tfoot = co('tfoot',
	co('tr', {ondata: function() {
		return this.tableContext.cols
	}},
		el('th', '>'),
		li('th', {
			ondata: function(v, i) {
				var ctx = this.tableContext
				this.el.style.color = (this.key === ctx.focus[1]) ? 'blue' : 'black'
				this.el.textContent = i
			}
		}),
		el('th', 'A')
	)
)
var tbody = co('tbody',
	li('tr', {
		ondata: function(row) {
			var ctx = this.tableContext
			this.el.style.color = (this.key === ctx.focus[0]) ? 'blue' : 'black'
			return ctx.sort[1].map(function(k) { return {k:k, v: row.v[k]} })
		}
	}, [
		co('td', icon),
		li('td', {
			ondata: function(col) {
				//console.log('tdEdit', col, idx)
				this.el.textContent = col.v
			}
		}),
		co('td', {
			ondata: function(v) {
				this.el.textContent = v.length
			}
		})
	])
)
module.exports = co('div',
	co('table', {ondata: editTable}, [thead, tbody, tfoot])
)
