import {NodeCo, ncProto} from './NodeCo'
import {each} from './object'


/**
 * @constructor
 * @param {Node} node - DOM node
 * @param {Array} [transforms] - configuration
 */
export function NodeModel(node, transforms) {
	this.node = node
	this._ops = transforms || []
}

NodeModel.prototype = {
	constructor: NodeModel,
	config: function(config) {
		return (new NodeModel(this.node, this._ops.slice()))._config(config)
	},
	assign: function(key, val) {
		return new NodeModel(this.node, this._ops.concat({
			fcn: ncProto.assign,
			arg: val === undefined ? key : [key, val]
		}))
	},
	defaults: function(key, val) {
		return new NodeModel(this.node, Array.prototype.concat({
			fcn: ncProto.assign,
			arg: val === undefined ? key : [key, val]
		}, this._ops))
	},
	rebase: function(config) {
		var co = this.create(config)
		return new NodeModel(co.node)._config({assign: co})
	},
	create: function(config) {
		return new NodeCo(
			this.node.cloneNode(true),
			(config ? this.config(config) : this)._ops
		)
	},
	_config: function(any) {
		if (any != null) {
			if (typeof any === 'function') this._ops.push({fcn: ncProto.call, arg: any})
			else if (any.constructor === Object) each(any, this.addTransform, this)
			else this._ops.push({fcn: ncProto.append, arg: any})
		}
		return this
	},
	addTransform: function(argument, name) {
		var transforms = this._ops
		if ((name[0] !== 'u' || name[1] !== 'p') && typeof ncProto[name] === 'function') { //methodCall, exclude /^up.*/
			transforms.push({fcn: ncProto[name], arg: argument})
		}
		else if (name === 'defaults') transforms.unshift({fcn: ncProto.assign, arg: argument})
		else transforms.push({fcn: ncProto.assign, arg: [name, argument]})
		return transforms
	}
}
