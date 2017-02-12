var UNDEF = 'undefined',
		$$doc = typeof document === UNDEF ? null : document

module.exports = {
	window: typeof window === UNDEF ? null : window,
	Node: typeof Node === UNDEF ? null : Node,
	get document() { return $$doc },
	set document(doc) {
		$$doc = doc
		this.window = doc.defaultView
		this.Node = doc.defaultView.Node
	}
}
