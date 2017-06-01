import {CElementProto} from './_c-element'
import {picoKey} from './picoKey'


/**
 * @constructor
 * @param {Node} node - DOM node
 */
export function CNode(node) {
	this.root = null
	this.node = node
	node[picoKey] = this
}

CNode.prototype = {
	constructor: CNode,
	foot: null,
	prop: CElementProto.prop,
	extra: CElementProto.extra,
	moveTo: CElementProto.moveTo,
	remove: CElementProto.remove,
	destroy: CElementProto.remove,
	text: nodeValue,
	update: nodeValue
}

function nodeValue(val) {
	this.node.nodeValue = val
}
