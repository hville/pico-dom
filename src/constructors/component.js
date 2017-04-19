import {getExtra, setExtra} from '../extras'
import {cloneChildren} from '../util/clone-children'
import {reduce, setter} from '../util/reduce'

/**
 * @constructor
 * @param {Object} node - DOM node
 * @param {Object} [extra] - configuration
 * @param {*} [key] - optional data key
 * @param {number} [idx] - optional position index
 */
export function Component(node, extra, key, idx) {
	//decorate: key, init, update, onmove, handleEvents...
	if (extra) reduce(extra, setter, this)
	if (key !== void 0) this.key = key

	// register and init
	this.node = node
	setExtra(node, this)
	if (this.init) this.init(key, idx)
}

Component.prototype = {
	constructor: Component,

	/**
	* @function clone
	* @param {*} [key] - optional key
	* @param {number} [idx] - optional position index
	* @return {!Component} new Component
	*/
	clone: function clone(key, idx) {
		var sourceNode = this.node,
				targetNode = sourceNode.cloneNode(false)
		cloneChildren(targetNode, sourceNode.firstChild)
		return new Component(targetNode, this, key, idx)
	},

	update: updateChildren,
	updateChildren: updateChildren,

	/**
	* @function moveTo
	* @param  {Object} parent parentNode
	* @param  {Object} [before] nextSibling
	* @return {!Component} this
	*/
	moveTo: function moveTo(parent, before) {
		var node = this.node,
				oldParent = node.parentNode
		if (parent) parent.insertBefore(node, before || null)
		else if (oldParent) oldParent.removeChild(node)
		if (this.onmove) this.onmove(oldParent, parent)
		return this
	},

	/**
	* @function setText
	* @param  {string} text textNode data
	* @return {!Component} this
	*/
	setText: function setText(text) {
		var node = this.node,
				child = node.firstChild
		if (child && !child.nextSibling && child.nodeValue !== text) child.nodeValue = text
		else node.textContent = text
		return this
	},

	/**
	* @function removeChildren
	* @param  {Object} [after] optional last node to be kept
	* @return {!Component} this
	*/
	removeChildren: function removeChildren(after) {
		var last = parent.lastChild

		while (last && last != after) { //eslint-disable-line eqeqeq
			var extra = getExtra(last)
			if (extra) extra.moveTo(null)
			else parent.removeChild(last)
			last = parent.lastChild
		}
		return this
	}
}

/**
* @function updateChildren
* @param  {...*} optional arguments
* @return {!Component} list instance
*/
function updateChildren() {
	var ptr = this.node.firstChild
	while (ptr) {
		var extra = getExtra(ptr)
		if (extra) {
			extra.update.apply(extra, arguments)
			ptr = (extra.footer || ptr).nextSibling
		}
		else ptr = ptr.nextSibling
	}
	return this
}
