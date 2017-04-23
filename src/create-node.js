import {defaultView} from './default-view'
import {addChild} from './patch'
import {Lens} from './lens'
import {setText} from './patch'

var svgURI = 'http://www.w3.org/2000/svg'

/**
* @function comment
* @param  {string} string commentNode data
* @return {!Object} commentNode
*/
export function createComment(string) {
	return defaultView.document.createComment(string)
}

/**
* @function fragment
* @return {!Object} documentFragment
*/
export function createDocumentFragment() {
	return defaultView.document.createDocumentFragment()
}

/**
* @function text
* @param  {string|Lens} text textNode data
* @return {!Object} textNode
*/
export function createTextNode(text) {
	var doc = defaultView.document
	if (text instanceof Lens) {
		return setText(text, doc.createTextNode('')) // integrate logic here???
	}
	return doc.createTextNode(text)
}

export function createElement(tag) {
	var node = tag.nodeType ? tag : defaultView.document.createElement(tag)
	for (var i=1; i<arguments.length; ++i) decorate(node, arguments[i])
	return node
}

export function createElementNS(nsURI, tag) {
	var node = tag.nodeType ? tag : defaultView.document.createElementNS(nsURI, tag)
	for (var i=2; i<arguments.length; ++i) decorate(node, arguments[i])
	return node
}

export function createElementSVG(tag) {
	var node = tag.nodeType ? tag : defaultView.document.createElementNS(svgURI, tag)
	for (var i=1; i<arguments.length; ++i) decorate(node, arguments[i])
	return node
}

function decorate(node, stuff) {
	if (typeof stuff === 'function') stuff(node)
	else addChild(stuff, node)
}
