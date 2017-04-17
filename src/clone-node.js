import {getExtra} from './node-extra'
import {Component} from './constructors/component'
import {List} from './constructors/list'

export function cloneNode(node, key, idx) {
	var copy = node.cloneNode(false),
			extra = getExtra(node)

	// copy DOM nodes before extra behaviour
	var nodeChild = node.firstChild
	while(nodeChild) {
		copy.appendChild(cloneNode(nodeChild))
		nodeChild = nodeChild.nextSibling
	}

	if (extra) {
		if (extra.header) new List(extra.factory, extra.dataKey)
		else new Component(copy, extra, key, idx)
	}
	return copy
}

