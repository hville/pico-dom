import {D} from './document'
import {NodeModel} from './_node-model'
import {ListModel} from './_list-model'
import {reduce} from './object'

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
 * @function template
 * @param {Node|Object} model source node or template
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function template(model, options) { //eslint-disable-line no-unused-vars
	var modl = new NodeModel(createNode(model))
	for (var i=1; i<arguments.length; ++i) modl._config(arguments[i])
	return modl
}

export function view(model, target, store) {
	return (store ? model.defaults({store: store}) : model).create().moveTo(target)
}

export function createNode(model) {
	if (model.cloneNode) return model.cloneNode(true)
	if (typeof model === 'number' || typeof model === 'string') return D.createTextNode('' + model)
	if (model.create) return model.create().node
	if (model.node) return model.node.cloneNode(true)
	else throw Error('invalid node source' + typeof model)
}

/**
 * @function list
 * @param {Object|Array} model model
 * @param {...*} [options] options
 * @return {!Object} Component
 */
export function list(model, options) { //eslint-disable-line no-unused-vars
	var modl = getModel(model)
	if (!modl) throw Error('invalid list template: ' + typeof model)
	var lst = new ListModel(modl)
	for (var i=1; i<arguments.length; ++i) lst._config(arguments[i])
	return lst
}


function getModel(tmpl) {
	return Array.isArray(tmpl) ? tmpl.map(getModel)
		: tmpl.constructor === Object ? reduce(tmpl, getModels, {})
		: tmpl.create ? tmpl // templates are immutable and can be used 'as-is'
		: createNode(tmpl)
}


function getModels(models, tmpl, key) {
	models[key] = getModel(tmpl)
	return models
}
