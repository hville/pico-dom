var store = new WeakMap()

module.exports = function extra(node, plus) {
	switch (arguments.length) {
		case 2:
			if (!plus) store.delete(node)
			else store.set(node, plus)
			return plus
		case 1:
			return store.get(node)
		default:
			throw Error('Invalid arguments')
	}
}
