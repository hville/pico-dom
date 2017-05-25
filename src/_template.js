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
				cmp = new this.Co(callOp(D, ops[0]))
		if (parent) cmp.root = parent.root || parent
		if (key !== undefined) cmp.key = key

		for (var i=1; i<ops.length; ++i) callOp(cmp, ops[i])
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
		for (var i=1, args=[fcn]; i<arguments.length; ++i) args[i] = arguments[i]
		this.ops.push(args)
		return this
	},

	config: function(any) {
		if (any != null) {
			if (typeof any === 'function') this.ops.push([any])
			else if (any.constructor === Object) {
				for (var i=0, ks=Object.keys(any); i<ks.length; ++i) {
					var key = ks[i],
							arg = any[ks[i]]
					if (Array.isArray(arg)) this[key](arg[0], arg[1])
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

function wrapMethod(name) {
	return function(a, b) {
		var proto = this.Co.prototype
		if (typeof proto[name] !== 'function') throw Error (name + ' is not a valid method for this template')
		var op = [proto[name]]

		if (arguments.length === 1) op.push(a)
		else if (arguments.length === 2) op.push(a, b)
		else if (arguments.length > 2) {
			op.push([a, b])
			for (var i=2; i<arguments.length; ++i) op[1].push(arguments[i])
		}

		this.ops.push(op)
		return this
	}
}

function callOp(ctx, op) {
	return !op[0] ? op[1]
		: op.length === 0 ? op[0].call(ctx)
		: op.length === 1 ? op[0].call(ctx, op[1])
		: op[0].call(ctx, op[1], op[2])
}
