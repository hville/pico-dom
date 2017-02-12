/*
TAKEWAYS
	* 'REDOM' style only works for components with single head element
	* named sub children
	* all function return an instance
	* all arguments must be re-parsed on every calls
*/

var el, co, li

//REDOM STYLE: co, el, li => instance
function Custom() {
	this.el = el('div',
		el('table',
			el('thead',
				// NOTE this style implies co()=>instance
				// ...and re-parsing of arguments on every new Custom()
				this.headerRow = co('tr',
					// NOTE only a component could keep track of prev/succ groups
					//   el < el|co
					//   co < li|gr|co|el
					el('td', 'Qty'),
					// NOTE: mounting must be done by parent
					this.headerCols = li('td'),
					el('td', 'Sum')
				)
			),
			this.body = new Body()
		)
	)
	this.update = function(v) {
		this.headerCols.update(v)
		this.headerRow.children.update(v) //update and remount
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
