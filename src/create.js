import {D} from './document'
import {Template} from './_template'
import {CElement} from './_c-element'
import {CNode} from './_c-node'
import {CList} from './_c-list'

var svgURI = 'http://www.w3.org/2000/svg'


/**
 * @function svg
 * @param {string} tag tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function svg(tag, options) { //eslint-disable-line no-unused-vars
	var model = new Template(CElement, [{f: D.createElementNS, a:[svgURI, tag]}])
	for (var i=1; i<arguments.length; ++i) model._config(arguments[i])
	return model
}


/**
 * @function element
 * @param {string} tagName tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function element(tagName, options) { //eslint-disable-line no-unused-vars
	var model = new Template(CElement, [{f: D.createElement, a: [tagName]}])
	for (var i=1; i<arguments.length; ++i) model._config(arguments[i])
	return model
}

/**
 * @function elementNS
 * @param {string} nsURI namespace URI
 * @param {string} tag tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function elementNS(nsURI, tag, options) { //eslint-disable-line no-unused-vars
	var model = new Template(CElement, [{f: D.createElementNS, a: [nsURI, tag]}])
	for (var i=2; i<arguments.length; ++i) model._config(arguments[i])
	return model
}

/**
 * @function text
 * @param {string} txt textContent
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function text(txt, options) { //eslint-disable-line no-unused-vars
	var model = new Template(CNode, [{f: D.createTextNode, a: [txt]}])
	for (var i=1; i<arguments.length; ++i) model._config(arguments[i])
	return model
}


/**
 * @function template
 * @param {Node|Element} node source node
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function template(node, options) { //eslint-disable-line no-unused-vars
	if (!node.nodeType || node.parentNode) throw Error('invalid or already used node')

	var modl = new Template(
		node.nodeType === 1 ? CElement : CNode,
		[{f: cloneNode, a: [node]}])
	for (var i=1; i<arguments.length; ++i) modl._config(arguments[i])
	return modl
}

function cloneNode(node) {
	return node.cloneNode(true)
}


/**
 * @function list
 * @param {Object|Array} model model
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function list(model, options) { //eslint-disable-line no-unused-vars
	var lst = new Template(CList, [{f:null, a:[model]}])

	for (var i=1; i<arguments.length; ++i) lst._config(arguments[i])
	return lst
}
