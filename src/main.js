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
/*
function onclick(evt) {
	ctx = this
}




ctx does not have reverence to node???
> no auto update children
> no moveto
	moveto: function moveto(parent, before) {
		var oldParent = this.parentNode
		parent.insertBefore(node, before || null)
		if (this.onmove) this.onmove(oldParent, parent)
		return node
	}

*/
