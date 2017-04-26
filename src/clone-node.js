import {extras} from './extras'

//TODO delete?

export function cloneNode(node, deep) { //TODO change instanceof to List properties
	// components have their own logic
	var extra = node.update ? node : extras.get(node) //TODO isCo
	if (extra) {
		return extra.foot ? extra.clone(deep).foot : extra.clone(deep).node
	}

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
