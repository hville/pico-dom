import {getExtras} from './node-extra'

export function updateNode(node, v,k,o) {
	var extra = getExtras(node)
	if (extra && extra.update) extra.update.call(node, v,k,o)
	return node
}

export function updateChildren(node, v,k,o) {
	var ptr = node.firstChild
	while (ptr) {
		var extra = getExtras(ptr)
		if (extra) {
			extra.update.call(node, v,k,o)
			ptr = (extra.footer || ptr).nextSibling
		}
		else ptr = ptr.nextSibling
	}
	return node
}
