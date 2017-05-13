import {text} from './create'
//import {ListA} from './ListA'
import {ListK} from './ListK'
import {ListS} from './ListS'
import {assignToThis} from './object'
import {reduce} from './object'


/**
 * @constructor
 * @param {!Object} model model
 */
export function ListModel(model) {
	this._assign(model)
	var template = this.template
	this.template = Array.isArray(template) ? template.map(getModel)
		: template.constructor === Object ? reduce(template, getModels, {})
		: getModel(template)
}


function getModels(models, template, key) {
	models[key] = getModel(template)
	return models
}


function getModel(template) {
	if (template.create) return template
	switch (typeof template) {
		case 'string' : return text(template)
		case 'number' : return text(''+template)
	}
	throw Error('invalid list template: ' + typeof template)
}


var lmProto = ListModel.prototype


lmProto.config = function(config) {
	return (new ListModel(this))._config(config)
}


lmProto.assign = function(key, val) {
	return (new ListModel(this))._assign(key, val)
}


lmProto.defaults = function(key, val) {
	return new ListModel(
		this._assign.call(
			val === undefined ? this._assign.call({}, key) : {key: val},
			this
		)
	)
}


lmProto.create = function(config) {
	var model = config ? this.config(config) : this
	return new (model.template.create ? ListK : ListS)(model)
}


lmProto._assign = assignToThis


lmProto._config = function(any) {
	if (any != null) {
		if (typeof any === 'function') any(this)
		else if (any.constructor === Object) for (var i=0, ks=Object.keys(any); i<ks.length; ++i) {
			var key = ks[i],
					val = any[key],
					fcn = this[key]
			if (typeof fcn === 'function') Array.isArray(val) ? fcn.apply(this, val) : fcn(val)
			else this._assign(key, val)
		}
	}
	return this
}
