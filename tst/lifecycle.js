var ct = require('cotest'),
		P = require('../dist/index.js')

if (!P.D) {
	// @ts-ignore
	var JSDOM = require('jsdom').JSDOM //eslint-disable-line global-require
	var win = (new JSDOM).window
	P.setDocument(win.document)
}


var el = P.element,
		list = P.list


ct('lifecycle - sync', function() { //TODO
	var moves = 0,
			removed = false,
			destroyed = false

	var co = el('h0').append(
		list(
			el('h1', {
				extras: {
					update: function(t) { this.text(t) }
				}
			})
		)
	).create()

	ct('===', moves, 0)
	ct('===', co.node.textContent, '')

	co.update(['a'])
	ct('===', moves, 1)
	ct('===', co.node.textContent, 'a')
	ct('===', removed, false)
	ct('===', destroyed, false)

	co.update([])
	ct('===', moves, 2)
	ct('===', co.node.textContent, '')
	ct('===', removed, true)
	ct('===', destroyed, true)
})


ct('lifecycle - async remove', function(end) {
	var moves = 0,
			removed = false,
			destroyed = false,
			removing = false

	var co = el('h0').append(
		list(
			el('h1', {
				extras: {
					onmove: function() { ++moves },
					onremove: function() {
						if (removed) return
						var ctx = this
						if (!removing) {
							removing = true
							setTimeout(function() { removed = true; ctx.remove() })
						}
						return true
					},
					ondestroy: function() { destroyed = true },
					update: function(t) { this.text(t) }
				}
			})
		)
	).create()

	ct('===', moves, 0)
	ct('===', co.node.textContent, '')

	co.update(['a'])
	ct('===', moves, 1)
	ct('===', co.node.textContent, 'a')
	ct('===', removed, false)
	ct('===', destroyed, false)

	co.update([])
	ct('===', moves, 1)
	ct('===', co.node.textContent, 'a')
	ct('===', removed, false)
	ct('===', destroyed, false)//
	end() //TODO
	setTimeout(function() {
		ct('===', moves, 2)
		ct('===', co.node.textContent, '')
		ct('===', removed, true)
		ct('===', destroyed, true)
		end()
	})
})
