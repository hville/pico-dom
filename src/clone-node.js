import {extras} from './extras'

export function cloneNode(node, deep) { //TODO change instanceof to List properties
	// components have their own logic
	var extra = extras.get(node)
	if (extra) return extra.clone(deep)

	// for plain elements
	var copy = node.cloneNode(false)
	return deep === false ? copy : cloneChildren(node, copy)
}

export function cloneChildren(node, copy) {
	var childNode = node.firstChild
	while(childNode) {
		var childCopy = cloneNode(childNode, true),
				nextNode = childCopy.nextSibling,
				extra = extras.get(childCopy)

		if (extra) extra.moveTo(copy)
		else copy.appendChild(childCopy)

		childNode = nextNode
	}
	return copy
}
