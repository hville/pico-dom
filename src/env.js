export default ENV

var ENV = {
	get document() { return init().document },
	get window() { return init().window },
	set window(win) { setWindow(win) },
}
function init() {
	if (typeof window !== 'undefined') return setWindow(window)
	throw Error('undefined window global (global or module property)')
}
function setWindow(win) {
	return Object.defineProperties(ENV, {
		document: {value: win.document},
		window: {value: win}
	})
}
