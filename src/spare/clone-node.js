import {Component} from './constructors/component'
import {getExtra, setExtra} from './node-extra'

/**
* @function comment
* @param  {string} string commentNode data
* @return {!Object} commentNode
*/
export function cloneNode(node, deep) {
	var clone = node.cloneNode(deep)
	// copy the node contexts
	if (deep) cloneExtraTree(clone, node)
	else cloneExtra(clone, node)
	return clone
}
function cloneExtra(clone, node) {
	setExtra(clone, new Component(clone, getExtra(node)))
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
