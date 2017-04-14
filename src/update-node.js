import {getExtra} from './node-extra'

export function updateNode(node, data) {
	var extra = getExtra(node)
	if (extra && extra.update) extra.update(data)
	return node
}
