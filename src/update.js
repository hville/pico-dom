import {extras} from './extras'

export function update(node, v,k,o) {
	var extra = extras.get(node)
	if (extra) {
		extra.update(v,k,o)
		return extra.foot || node
	}
	return updateChildren(node, v,k,o)
}
export function updateChildren(node, v,k,o) {
	var ptr = node.firstChild
	while (ptr) ptr = update(ptr, v,k,o).nextSibling
	return node
}
