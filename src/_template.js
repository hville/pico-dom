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

	create: function(parent) {
		var ops = this.ops,
				cmp = new this.Co(ops[0].call(D))
		if (parent) cmp.root = parent.root || parent
		for (var i=1; i<ops.length; ++i) ops[i].call(cmp)
		return cmp
	},

	clone: function(options) {
		var template = new Template(this.Co, this.ops.slice())
		if (options) template.config(options)
		return template
	},

	// COMPONENT OPERATIONS
	oncreate: function(fcn) { //TODO
		this.ops.push(new Op(call, fcn))
		return this
	},

	set: wrapMethod('set'),

	config: function(any) {
		if (any != null) {
			if (typeof any === 'function') this.ops.push(new Op(call, any))
			else if (any.constructor === Object) {
				for (var i=0, ks=Object.keys(any); i<ks.length; ++i) {
					var key = ks[i],
							arg = any[ks[i]]
					if (!this[key]) throw Error('invalid method name: ' + key)
					if (Array.isArray(arg)) this[key](arg[0], arg[1])
					else this[key](arg)
				}
			}
			else this.child(any)
		}
		return this
	},

	// ELEMENT OPERATIONS

	on: wrapMethod('on'),
	attr: wrapMethod('attr'),
	prop: wrapMethod('prop'),
	class: wrapMethod('class'),

	child: function() {
		var proto = this.Co.prototype
		for (var i=0; i<arguments.length; ++i) {
			var child = arguments[i]
			if (child != null) {
				if (Array.isArray(child)) this.child.apply(this, child)
				else this.ops.push(
					child.create ? new Op(proto._childTemplate, child) //TODO
					: child.cloneNode ? new Op(proto._childNode, child)
					: new Op(proto._childText, ''+child)
				)
			}
		}
		return this
	}
}


function call(fcn) {
	fcn.call(this, this.node) //TODO
}

function wrapMethod(name) {
	return function(a, b) {
		var proto = this.Co.prototype
		if (typeof proto[name] !== 'function') throw Error (name + ' is not a valid method for this template')
		this.ops.push(new Op(proto[name], a, b))
		return this
	}
}
