//import {ListA} from './ListA'
import {assignToThis} from './object'
//import {Op} from './_op'
//import {D} from './document'


/**
 * @constructor
 * @param {!Object} constructor
 * @param {!Array} transforms
 */
export function ListModel(constructor, model, options) {
	this.Co = constructor
	this._template = model
	if (options) this._assign(options)
}


var lmProto = ListModel.prototype


lmProto.config = function(config) { //TODO delete
	return (new ListModel(this.Co, this._template, this))._config(config)
}


lmProto.assign = function(key, val) {
	return (new ListModel(this.Co, this._template, this))._assign(key, val)
}


lmProto.create = function(config) {
	var model = config ? this.config(config) : this
	return new this.Co(model._template, model)
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
