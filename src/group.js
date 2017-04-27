import {extras} from './extras'
import {setChildren, updateChildren, insertBefore} from './children'
import {DOC} from './document'
import {cloneNode} from './clone-node'
import {concatPatch, updatePatch} from './patch'

export function createGroup(nodes) {
	var fr = (new Group).moveTo(DOC.createDocumentFragment())
	if (nodes) fr.nodes = nodes
	return fr
}

/**
 * @constructor
 */
export function Group() {
	//required to keep parent ref when no children.length === 0
	this.head = DOC.createComment('^') //only required if not first
	this.foot = DOC.createComment('$')
	extras.set(this.head, this)
	extras.set(this.foot, this)
}
Group.prototype = {
	constructor: Group,
	patch: null,
	update: function(v,k,o) {
		this.updateSelf(v,k,o)
		this.updateChildren(v,k,o)
		return this
	},
	updateSelf: updatePatch,
	concatPatch: concatPatch,
	get nodes() {
		var nodes = [],
				head = this.head
		if (!head.parentNode) return []
		var child = this.head.nextSibling
		while(child !== this.foot) {
			nodes.push(child)
			child = child.nextSibling
		}
		return nodes
	},
	set nodes(nodes) {
		var head = this.head
		if (!head.parentNode) this.moveTo(DOC.createDocumentFragment())
		var parent = head.parentNode
		insertBefore.call(parent, nodes, this.foot)
		setChildren(parent, null, head, nodes || nodes[0])

		setChildren(
			head.parentNode,
			Array.isArray(nodes) ? nodes.map(extras.node) : [extras.node(nodes)],
			head,
			this.foot
		)
	},

	/**
	* @function clone
	* @return {!List} new List
	*/
	clone: function() {
		var group = new Group
		group.nodes = this.nodes.map(cloneNode)
		return group
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
				var nodes = this.nodes
				target.insertBefore(head, cursor)
				target.insertBefore(foot, cursor)
				setChildren(target, nodes, head, foot)
			}
		}
		return this
	},
	updateChildren: function(v,k,o) {
		updateChildren(this.head.parentNode, v,k,o, this.head, this.foot)
	}
}
