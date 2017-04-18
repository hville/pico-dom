import {decorators} from './decorators'
import {reduce} from './util/reduce'

/**
 * Parse a CSS-style selector string and return a new Element
 * @param {!Object} element - element to be decorated
 * @param {Object} config - The existing definition to be augmented
 * @param {Array} [children] - Element children Nodes,Factory,Text
 * @returns {!Object} - The parsed element definition [sel,att]
 */
export function decorate(element, config, children) {
	reduce(config, run, element)
	if (children) decorators.children(element, children)
	return element
}
function run(elm, val, key) {
	return decorators[key] ? decorators[key](elm, val) : elm
}
