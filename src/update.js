import {extras} from './extras'

export function update(node, v,k,o) {
	var extra = node.update ? node : extras.get(node)
	if (extra) return extra.update(v,k,o)
	return node
}
