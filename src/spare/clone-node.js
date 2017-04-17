import {Component} from './constructors/component'
import {getExtras, setExtras} from './node-extra'

export function cloneNode(node, deep) {
	var clone = node.cloneNode(deep)
	// copy the node contexts
	if (deep) cloneExtraTree(clone, node)
	else cloneExtra(clone, node)
	return clone
}
function cloneExtra(clone, node) {
	setExtras(clone, new Component(clone, getExtras(node)))
}
function cloneExtraTree(clone, node) {
	cloneExtra(clone, node)
	node = node.firstChild
	clone = clone.firstChild
	while(node) {
		cloneExtraTree(clone, node)
		node = node.nextSibling
		clone = clone.nextSibling
	}
}
