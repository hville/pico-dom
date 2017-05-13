import {D} from './document'
import {NodeModel} from './NodeModel'
import {ListModel} from './ListModel'

var svgURI = 'http://www.w3.org/2000/svg'


/**
 * @function svg
 * @param {string} tag tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function svg(tag, options) { //eslint-disable-line no-unused-vars
	var template = new NodeModel(D.createElementNS(svgURI, tag))
	for (var i=1; i<arguments.length; ++i) template._config(arguments[i])
	return template
}

/**
 * @function element
 * @param {string} tagName tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function element(tagName, options) { //eslint-disable-line no-unused-vars
	var template = new NodeModel(D.createElement(tagName))
	for (var i=1; i<arguments.length; ++i) template._config(arguments[i])
	return template
}

/**
 * @function elementNS
 * @param {string} nsURI namespace URI
 * @param {string} tag tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function elementNS(nsURI, tag, options) { //eslint-disable-line no-unused-vars
	var template = new NodeModel(D.createElementNS(nsURI, tag))
	for (var i=2; i<arguments.length; ++i) template._config(arguments[i])
	return template
}

/**
 * @function text
 * @param {string} txt textContent
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function text(txt, options) { //eslint-disable-line no-unused-vars
	var template = new NodeModel(D.createTextNode(txt))
	for (var i=1; i<arguments.length; ++i) template._config(arguments[i])
	return template
}


/**
 * @function list
 * @param {Object|Array} model template
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function list(model, options) { //eslint-disable-line no-unused-vars
	var template = new ListModel({template: model})
	for (var i=1; i<arguments.length; ++i) template._config(arguments[i])
	return template
}
