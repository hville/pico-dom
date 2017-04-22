export function find(root, test, after) {
	var node = (after || root)
	do {
		var next = node.firstChild
		if (!next) while(!(next = node.nextSibling)) {
			node = node.parentNode
			if (node === root) return null //back to the root node
		}
		node = next
	} while(!test(node))
	return node
}
