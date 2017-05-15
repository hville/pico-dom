import {text} from './create'
//import {ListA} from './ListA'
import {ListK} from './ListK'
import {ListS} from './ListS'
import {assignToThis} from './object'
import {reduce} from './object'
//import {D} from './document'


/**
 * @constructor
 * @param {!Object} model model
 */
export function ListModel(model) {
	this._assign(model)
	var tmpl = this.template
	this.template = Array.isArray(tmpl) ? tmpl.map(getModel)
		: tmpl.constructor === Object ? reduce(tmpl, getModels, {})
		: getModel(tmpl)
}


function getModels(models, tmpl, key) {
	models[key] = getModel(tmpl)
	return models
}


function getModel(tmpl) {
	if (tmpl.create) return tmpl // templates are immutable and can be used 'as-is'
	switch (typeof tmpl) {
		case 'string' : return text(tmpl)
		case 'number' : return text(''+tmpl)
	}
	throw Error('invalid list template: ' + typeof tmpl)
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
