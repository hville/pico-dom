var weakmap = new WeakMap()

module.exports = function main(node, plus) {
	switch (arguments.length) {
		case 2:
			if (!plus) return weakmap.delete(node)
			else return weakmap.set(node, plus)
		case 1:
			return weakmap.get(node)
		case 0:
			return {}
	}
}
