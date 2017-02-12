/*
TAKEWAYS
??? el.children => NodeList
* live collection
* .length, .item(index)=>el
el.childNodes => HTMLCollection
* live collection
* DOM elements
* explorer?
* no automatic update calls
*/

var el, co, li
var headerFactory = co('tr',
	el('td', 'Qty'),
	li('td'),
	el('td', 'Sum')
)
function Custom(opt) {
	this.el = el('div',
		el('table',
			el('thead',
				this.headerRow = headerFactory(opt)
			),
			this.body = new Body(opt)
		)
	)(opt)
	this.update = function(v) {
		// children must be 'attached' to parent co for this to work
		this.headerRow.children.update(v) //update and remount
		this.headerRow.update(v) //update and remount
		this.rows.update.update(v)
	}
}
function Body() {
	this.el = el('tbody',
		li('tr',
			co('td'),
			li('td'),
			co('td')
		)
	)
	this.update = function() {
		//yuk
	}
}
