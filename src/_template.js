import {Op} from './_op'
import {D} from './document'


/**
 * @constructor
 * @param {!Function} constructor
 * @param {!Array} transforms
 */
export function Template(constructor, transforms) {
	this.Co = constructor
	this.ops = transforms || []
}

Template.prototype = {
	constructor: Template,

	create: function(keyVal) {
		var ops = this.ops,
				cmp = new this.Co(ops[0].call(D))
		if (keyVal) cmp.assign(keyVal) //TODO common
		for (var i=1; i<ops.length; ++i) ops[i].call(cmp)
		return cmp
	},

	clone: function(options) {
		var template = new Template(this.Co, this.ops.slice())
		if (options) template.config(options)
		return template
	},

	update: function(fcn) {
		this.ops.push(new Op(this.Co.prototype.assign, 'update', fcn))
		return this
	},

	updateOnce: function(fcn) {
		this.ops.push(new Op(this.Co.prototype.assign, 'updateOnce', fcn))
		this.ops.push(new Op(this.Co.prototype.assign, 'update', updateOnce))
		return this
	},

	select: function(fcn) {
		this.ops.push(new Op(this.Co.prototype.assign, 'select', fcn))
		return this
	},

	getKey: function(fcn) {
		this.ops.push(new Op(this.Co.prototype.assign, 'getKey', fcn))
		return this
	},
	/*key: function(key) { //TODO name
		return new Template(this.ops.concat(new Op(setKey, key)))
	},*/
	assign: wrapMethod('assign'), //TODO RENAME

	on: wrapMethod('on'),
	attr: wrapMethod('attr'),
	prop: wrapMethod('prop'),
	class: wrapMethod('class'),
	_childNode: wrapMethod('_childNode'),
	_childTemplate: wrapMethod('_childTemplate'),
	_childText: wrapMethod('_childText'),


	oncreate: function(fcn) { //TODO oncreate ONLY once (call in constructor)
		this.ops.push(new Op(call, fcn))
		return this
	},

	config: function(any) {
		if (any != null) {
			if (typeof any === 'function') this.ops.push(new Op(call, any))
			else if (any.constructor === Object) {
				for (var i=0, ks=Object.keys(any); i<ks.length; ++i) {
					var key = ks[i],
							arg = any[ks[i]],
							fcn = this.Co.prototype[key]
					if (!fcn) throw Error('invalid method name: ' + key)
					if (Array.isArray(arg)) this.ops.push(new Op(fcn, arg[0], arg[1]))
					else this.ops.push(new Op(fcn, arg))

				}
			}
			else this.child(any)
		}
		return this
	},

	child: function() {
		var proto = this.Co.prototype
		for (var i=0; i<arguments.length; ++i) {
			var child = arguments[i]
			if (child != null) {
				if (Array.isArray(child)) this.child.apply(this, child)
				else this.ops.push(
					child.create ? new Op(proto._childTemplate, child)
					: child.cloneNode ? new Op(proto._childNode, child)
					: new Op(proto._childText, ''+child)
				)
			}
		}
		return this
	}
}


function call(fcn) {
	fcn.call(this, this.node)
}

function wrapMethod(name) {
	return function(a, b) {
		var proto = this.Co.prototype
		if (typeof proto[name] !== 'function') throw Error (name + ' is not a valid method for this template')
		this.ops.push(new Op(proto[name], a, b))
		return this
	}
}

function updateOnce(v,k,o) {
	this.updateOnce(v,k,o)
	this.update = null
	return this
}
