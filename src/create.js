import {D} from './document'
import {Template} from './_template'
import {NodeCo} from './_node-co'
import {ListModel} from './_list-model'
import {reduce} from './object'
import {Op} from './_op'
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
	var model = new Template(NodeCo, [new Op(D.createElementNS, svgURI, tag)])
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
	var model = new Template(NodeCo, [new Op(D.createElement, tagName)])
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
	var model = new Template(NodeCo, [new Op(D.createElementNS, nsURI, tag)])
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
	var model = new Template(NodeCo, [new Op(D.createTextNode, txt)])
	for (var i=1; i<arguments.length; ++i) model._config(arguments[i])
	return model
}


/**
 * @function template
 * @param {Node|Object} model source node or template
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function template(model, options) { //eslint-disable-line no-unused-vars
	var modl = new Template(NodeCo, [
		model.cloneNode ? new Op(cloneNode, model)
		: typeof model === 'number' ? new Op(D.createTextNode, '' + model)
		: typeof model === 'string' ? new Op(D.createTextNode, model)
		: model.create ? new Op(cloneNode, model.create().node)
		: model.node ? new Op(cloneNode, model.node)
		: model
	])
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
	var lst = model.create ? new ListModel(ListK, model)
	: new ListModel(ListS, reduce(model, getModels, {}))

	for (var i=1; i<arguments.length; ++i) lst._config(arguments[i])
	return lst
}


function getModels(models, tmpl, key) {
	if (tmpl.create) models[key] = tmpl
	else throw Error('list item must be a template of a collection of templates')
	return models
}
