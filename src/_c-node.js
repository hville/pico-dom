import {CElementProto} from './_c-element'
import {picoKey} from './picoKey'


/**
 * @constructor
 * @param {Node} node - DOM node
 */
export function CNode(node) {
	this.root = null
	this.node = node
	this.update = this.text
	node[picoKey] = this
}

CNode.prototype = {
	constructor: CNode,

	prop: CElementProto.prop,
	extra: CElementProto.extra,
	moveTo: CElementProto.moveTo,
	remove: CElementProto.remove,
	destroy: CElementProto.destroy,

	text: function(val) {
		this.node.nodeValue = val
	}
}
