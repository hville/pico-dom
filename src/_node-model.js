import {NodeCo, ncProto} from './_node-co'
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

	create: function(keyVal) {
		var co = new NodeCo(this.node.cloneNode(true)),
				ops = this._ops

		if (keyVal) co.assign(keyVal)
		for (var i=0; i<ops.length; ++i) {
			var op = ops[i]
			if (Array.isArray(op.arg)) op.fcn.apply(co, op.arg)
			else op.fcn.call(co, op.arg)
		}
		return co
	},

	_config: function(any) {
		if (any != null) {
			if (typeof any === 'function') this._ops.push({fcn: ncProto.call, arg: any})
			else if (any.constructor === Object) each(any, this.addTransform, this)
			else this._ops.push({fcn: ncProto.append, arg: any})
		}
		return this
	},
	addTransform: function(argument, name, source) {
		var transforms = this._ops
		if ((name[0] !== 'u' || name[1] !== 'p') && typeof ncProto[name] === 'function') { //methodCall, exclude /^up.*/
			transforms.push({fcn: ncProto[name], arg: argument})
		}
		else if (name === 'common') transforms.unshift({fcn: ncProto.assign, arg: source})
		else transforms.push({fcn: ncProto.assign, arg: [name, argument]})
		return transforms
	}
}
