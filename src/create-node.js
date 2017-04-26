import {DOC} from './document'
import {Getter} from './getter'
import {Extra} from './extra'

var svgURI = 'http://www.w3.org/2000/svg'

/**
* @function text
* @param  {string|Getter} text textNode data
* @return {!Object} textNode
*/
export function createTextNode(text) {
	if (text instanceof Getter) return (new Extra(DOC.createTextNode(''))).setText(text)
	return new Extra(DOC.createTextNode(text || ''))
}

export function createElement(tag) { //TODO addChild
	return new Extra(tag.nodeType ? tag : DOC.createElement(tag))
}

export function createElementNS(nsURI, tag) {
	return new Extra(tag.nodeType ? tag : DOC.createElementNS(nsURI, tag))
}

export function createElementSVG(tag) {
	return new Extra(tag.nodeType ? tag : DOC.createElementNS(svgURI, tag))
}
