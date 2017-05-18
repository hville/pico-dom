//import {ListA} from './ListA'
import {ListK} from './_list-k'
import {ListS} from './_list-s'
import {assignToThis} from './object'

//import {D} from './document'


/**
 * @constructor
 * @param {!Object} model
 * @param {Object} [options]
 */
export function ListModel(model, options) {
	this._template = model
	if (options) this._assign(options)
}


var lmProto = ListModel.prototype


lmProto.config = function(config) {
	return (new ListModel(this._template, this))._config(config)
}


lmProto.assign = function(key, val) {
	return (new ListModel(this._template, this))._assign(key, val)
}


lmProto.create = function(config) {
	var model = config ? this.config(config) : this
	return new (model._template.create || model._template.cloneNode ? ListK : ListS)(model._template, model)
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
