var ENV = {
	get document() { return init().document },
	get Node() { return init().Node },
	get window() { return init().window },
	set window(win) { setWindow(win) }
}
function init() {
	if (typeof window !== 'undefined') return setWindow(window)
	throw Error('window must first be defined (global or module property)')
}
function setWindow(win) {
	return Object.defineProperties(ENV, {
		document: {value: win.document},
		Node: {value: win.Node},
		window: {value: win}
	})
}
module.exports = ENV
