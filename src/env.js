
var ENV = {
	get document() { return init().document },
	get window() { return init().window },
	set window(win) { setWindow(win) },
	extra: getWeak(),
	namespaces: {
		html: 'http://www.w3.org/1999/xhtml',
		svg : 'http://www.w3.org/2000/svg'
	},
	text: function text(string) {
		return ENV.document.createTextNode(string)
	},
	fragment: function fragment() {
		return ENV.document.createDocumentFragment()
	},
	comment: function comment(string) {
		return ENV.document.createComment(string)
	}
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
function getWeak() {
	if (typeof WeakMap !== 'undefined') return new WeakMap()
	return {
		set: function(node, comp) { node._$comp_ = comp },
		get: function(node) { return node._$comp_ }
	}
}
module.exports = ENV
