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
	var model = new NodeModel(D.createElementNS(svgURI, tag))
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
	var model = new NodeModel(D.createElement(tagName))
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
	var model = new NodeModel(D.createElementNS(nsURI, tag))
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
	var model = new NodeModel(D.createTextNode(txt))
	for (var i=1; i<arguments.length; ++i) model._config(arguments[i])
	return model
}


/**
 * @function list
 * @param {Object|Array} model model
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function list(model, options) { //eslint-disable-line no-unused-vars
	var modl = new ListModel({template: model})
	for (var i=1; i<arguments.length; ++i) modl._config(arguments[i])
	return modl
}


/**
 * @function template
 * @param {Node|Object} model source node or template
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function template(model, options) { //eslint-disable-line no-unused-vars
	var modl = model.rebase ? model.rebase()
		: model.node ? new NodeModel(model.node)._config({assign: model})
		: new NodeModel(model)
	for (var i=1; i<arguments.length; ++i) modl._config(arguments[i])
	return modl
}
