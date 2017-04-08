export default function find(test, after) {
	var node = (after || this.node)
	do {
		var next = node.firstChild
		if (!next) while(!(next = node.nextSibling)) {
			node = node.parentNode
			if (node === this.node) return null //back to the root node
		}
		node = next
	} while(!test(node))
	return node
}
