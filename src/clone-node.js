import {getExtra} from './extras'
import {Component} from './constructors/component'
import {List} from './constructors/list'
//import {replaceChildren} from '/replace-children'

export function cloneNode(node, deep) { //TODO change instanceof to List properties
	var extra = getExtra(node)
	if (extra instanceof List) return (new List(extra.factory, extra.dataKey)).footer //TODO header or footer?

	// copy DOM nodes before extra behaviour
	var copy = node.cloneNode(false)

	if (deep !== false) {
		var childNode = node.firstChild
		while(childNode) {
			var childCopy = cloneNode(childNode, true),
					childExtra = getExtra(childNode),
					nextNode = (childExtra && childExtra.footer || childNode).nextSibling

			if (childExtra instanceof List) getExtra(childCopy).moveTo(copy)
			else copy.appendChild(childCopy)

			childNode = nextNode
		}
	}

	if (extra) new Component(copy, extra)
	return copy
}
