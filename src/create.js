import {D} from './document'
import {Template} from './_template'
import {NodeCo} from './_node-co'
import {ListK} from './_list-k'
import {ListS} from './_list-s'

var svgURI = 'http://www.w3.org/2000/svg'


/**
 * @function svg
 * @param {string} tag tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function svg(tag, options) { //eslint-disable-line no-unused-vars
	var model = new Template(NodeCo, [[D.createElementNS, svgURI, tag]])
	for (var i=1; i<arguments.length; ++i) model.config(arguments[i])
	return model
}


/**
 * @function element
 * @param {string} tagName tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function element(tagName, options) { //eslint-disable-line no-unused-vars
	var model = new Template(NodeCo, [[D.createElement, tagName]])
	for (var i=1; i<arguments.length; ++i) model.config(arguments[i])
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
	var model = new Template(NodeCo, [[D.createElementNS, nsURI, tag]])
	for (var i=2; i<arguments.length; ++i) model.config(arguments[i])
	return model
}

/**
 * @function text
 * @param {string} txt textContent
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function text(txt, options) { //eslint-disable-line no-unused-vars
	var model = new Template(NodeCo, [[D.createTextNode, txt]])
	for (var i=1; i<arguments.length; ++i) model.config(arguments[i])
	return model
}


/**
 * @function template
 * @param {!Node} node source node
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function template(node, options) { //eslint-disable-line no-unused-vars
	if (!node.cloneNode) throw Error('invalid node')

	var modl = new Template(NodeCo, [[cloneNode, node]])
	for (var i=1; i<arguments.length; ++i) modl.config(arguments[i])
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
	var lst = new Template(
		model.create ? ListK : ListS,
		[[null, model]]
	)

	for (var i=1; i<arguments.length; ++i) lst.config(arguments[i])
	return lst
}
