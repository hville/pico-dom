import {extras} from './extras'
import {setChildren, updateChildren} from './children'
import {DOC} from './document'
import {cloneNode} from './clone-node'

export function createFragment(nodes) {
	var fr = new Fragment
	if (Array.isArray(nodes)) fr.nodes = nodes
	else if (nodes) fr.nodes = [nodes]
	return fr
}

/**
 * @constructor
 */
export function Fragment() {
	//required to keep parent ref when no children.length === 0
	this.head = DOC.createComment('^') //only required if not first
	this.foot = DOC.createComment('$')
	extras.set(this.head, this)
	extras.set(this.foot, this)
}
Fragment.prototype = {
	constructor: Fragment,
	get nodes() {
		var nodes = [],
				child = this.head.nextSibling
		while(child !== this.foot) {
			nodes.push(child)
			child = child.nextSibling
		}
		return nodes
	},
	set nodes(nodes) { setChildren(
		this.head.parentNode || DOC.createDocumentFragment(),
		Array.isArray(nodes) ? nodes : [nodes], //TODO Components?
		this.head,
		this.foot
	)},
/*	get nextSibling() { //TODO delete
		return this.foot.nextSibling
	},*/

	/**
	* @function clone
	* @return {!List} new List
	*/
	clone: function() {
		var fr = new Fragment
		fr.nodes = this.nodes.map(cloneNode)
		return fr
	},

	/**
	* @function moveTo
	* @param  {Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!List} this
	*/
	moveTo: function(parent, before) {
		var foot = this.foot,
				head = this.head,
				origin = head.parentNode,
				target = extras.node(parent),
				cursor = before || null
		// skip case where there is nothing to do
		if ((origin || target) && cursor !== foot && (origin !== target || cursor !== foot.nextSibling)) {
			// newParent == null -> remove only -> clear list and dismount head and foot
			if (!target) {
				setChildren(origin, null, head, foot)
				origin.removeChild(head)
				origin.removeChild(foot)
			}
			// relocate
			else {
				target.insertBefore(head, cursor)
				target.insertBefore(foot, cursor)
				setChildren(target, this.nodes, head, foot)
			}
		}
		return this
	},
	update: function(v,k,o) {
		updateChildren(this.head.parentNode, v,k,o, this.head, this.foot)
	}
}







