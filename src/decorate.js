import decorators from './decorators'

/**
 * Parse a CSS-style selector string and return a new Element
 * @param {Object} element - css like selector string
 * @param {Object} config - The existing definition to be augmented
 * @param {Array} [children] - Element children Nodes,Factory,Text
 * @returns {Object} - The parsed element definition [sel,att]
 */
export default function decorate(element, config, children) {
	// properties and attributes
	for (var i=0, ks=Object.keys(decorators); i<ks.length; ++i) {
		var key = ks[i],
				val = config[key]
		if (val) decorators[key](element, val)
	}
	// children
	for (var j=0; j<children.length; ++j) {
		var child = children[j]
		if (child.moveTo) child.moveTo(element)
		else element.appendChild(child)
	}
	return element
}
