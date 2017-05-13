import {D} from './document'


/**
 * @function
 * @param {*} child nodeLike
 * @param {Object} [defaults] childDefaults
 * @return {!Node|!Object} child
 */
export function initChild(child, defaults) {
	return child == null ? null
		: child.create ? child.defaults(defaults).create()
		: typeof child === 'number' ? D.createTextNode(''+child)
		: typeof child === 'string' ? D.createTextNode(child)
		: child
}
