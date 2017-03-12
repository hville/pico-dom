var WIN = typeof window === 'undefined' ? null : window
var ENV = {
	document: null,
	Node: null,
	get window() { return WIN },
	set window(win) {
		WIN = win
		ENV.document = win && win.document
		ENV.Node = win && win.Node
	}
}
ENV.window = WIN

module.exports = ENV
