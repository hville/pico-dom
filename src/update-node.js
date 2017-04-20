import {getExtra} from './extras'

export function updateNode(node, v,k,o) {
	var extra = getExtra(node)
	if (extra && extra.update) extra.update.call(node, v,k,o)
	return node
}

export function updateChildren(node, v,k,o) {
	var ptr = node.firstChild
	while (ptr) {
		var extra = getExtra(ptr)
		if (extra) {
			extra.update.call(node, v,k,o)
			ptr = (extra.footer || ptr).nextSibling
		}
		else ptr = ptr.nextSibling
	}
	return node
}
/*
export function updateNode(node, v,k,o) {
	var extra = getExtra(node)
	if (extra) {
		if (extra.edits) for (var i=0; i<extra.edits.length; ++i) {
			var edit = extra.edits[i]
			node = edit.red(node, edit.get.value(v), edit.key)
		}
		if (extra.footer) return extra.footer
	}
	var child = node.firstChild
	while (child) child = updateNode(child, v,k,o).nextSibling
	return node
}

*/
