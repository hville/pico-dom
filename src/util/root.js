var UNDEF = 'undefined',
		$$doc = typeof document === UNDEF ? null : document

module.exports = {
	window: typeof window === UNDEF ? null : window,
	Node: typeof Node === UNDEF ? null : Node,
	get document() { return $$doc },
	set document(doc) {
		var win = doc.defaultView
		$$doc = doc
		this.window = win
		this.Node = win.Node
	},
	extra: new WeakMap()
}
