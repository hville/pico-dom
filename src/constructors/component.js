import {getExtra, setExtra} from '../extras'
import {reduce} from '../util/reduce'
import {setProperty} from '../util/reducers'

/**
 * @constructor
 * @param {Object} node - DOM node
 * @param {Object} [extra] - configuration
 * @param {*} [key] - optional data key
 * @param {number} [idx] - optional position index
 */
export function Component(node, extra, key, idx) {
	//decorate: key, init, update, onmove, handleEvents...
	if (extra) reduce(extra, setProperty, this)
	if (key !== void 0) this.key = key

	// register and init
	this.node = node
	setExtra(node, this)
	if (this.init) this.init(key, idx)
}

Component.prototype = {
	constructor: Component,
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
