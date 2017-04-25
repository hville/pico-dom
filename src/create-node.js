import {defaultView} from './default-view'
import {addChild} from './patch'
import {Getter} from './getter'
import {setText} from './patch'
import {Extra} from './extra'

var svgURI = 'http://www.w3.org/2000/svg'

/**
* @function comment
* @param  {string} string commentNode data
* @return {!Object} commentNode
*/
export function createComment(string) {
	return new Extra(defaultView.document.createComment(string || ''))
}

/**
* @function fragment
* @return {!Object} documentFragment
*/
/*
TODO
export function createDocumentFragment() {
	return defaultView.document.createDocumentFragment()
}*/

/**
* @function text
* @param  {string|Getter} text textNode data
* @return {!Object} textNode
*/
export function createTextNode(text) {
	var doc = defaultView.document
	if (text instanceof Getter) return (new Extra(doc.createTextNode(''))).setText(text)
	return new Extra(doc.createTextNode(text || ''))
}

export function createElement(tag) {
	new Extra(doc.createTextNode(text || ''))
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
