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

	get node () {
		return this.create().node
	},

	create: function(parent, key) {
		var ops = this.ops,
				cmp = new this.Co(ops[0].call(D))
		if (parent) cmp.root = parent.root || parent
		if (key !== undefined) cmp.key = key

		for (var i=1; i<ops.length; ++i) ops[i].call(cmp)
		if (cmp.oncreate) cmp.oncreate()
		return cmp
	},

	clone: function(options) {
		var template = new Template(this.Co, this.ops.slice())
		if (options) template.config(options)
		return template
	},

	// COMPONENT OPERATIONS
	call: function(fcn) {
		this.ops.push(new Op(call, fcn))
		return this
	},

	config: function(any) {
		if (any != null) {
			if (typeof any === 'function') this.ops.push(new Op(call, any))
			else if (any.constructor === Object) {
				for (var i=0, ks=Object.keys(any); i<ks.length; ++i) {
					var key = ks[i],
							arg = any[ks[i]]
					if (!this[key]) this.set(key, arg)
					else if (Array.isArray(arg)) this[key](arg[0], arg[1])
					else this[key](arg)
				}
			}
			else this.append(any)
		}
		return this
	},

	extra: wrapMethod('extra'),

	// ELEMENT OPERATIONS

	on: wrapMethod('on'),
	attr: wrapMethod('attr'),
	prop: wrapMethod('prop'),
	class: wrapMethod('class'),
	append: wrapMethod('append')
}


function call(fcn) {
	fcn.call(this, this.node)
}

function wrapMethod(name) {
	return function(a, b) {
		var proto = this.Co.prototype
		if (typeof proto[name] !== 'function') throw Error (name + ' is not a valid method for this template')
		if (arguments.length > 2) {
			for (var i=0, args=[]; i<arguments.length; ++i) args[i] = arguments[i]
			this.ops.push(new Op(proto[name], args))
		}
		else this.ops.push(new Op(proto[name], a, b))
		return this
	}
}
