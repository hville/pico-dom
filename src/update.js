import {extras} from './extras'

export function update(node, v,k,o) {
	var extra = extras.get(node),
			last = extra && extra.update ? extra.update(node, v,k,o) : node

	var ptr = node.firstChild
	while (ptr) ptr = update(ptr, v,k,o).nextSibling
	return last
}
