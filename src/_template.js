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

	//COMMON

	create: function(parent, key) {
		var ops = this.ops,
				cmp = new this.Co(run(ops[0], D))

		if (parent) cmp.root = parent.root || parent
		if (key !== undefined) cmp.key = key

		for (var i=1; i<ops.length; ++i) run(ops[i], cmp)
		return cmp
	},

	// COMPONENT OPERATIONS
	call: function(fcn) {
		for (var i=1, args=[]; i<arguments.length; ++i) args[i-1] = arguments[i]
		return this._clone({f: fcn, a:args})
	},

	_clone: function(op) {
		var ops = this.ops
		return new Template(this.Co, ops.concat(op))
	},

	_ops: function(fcn, obj) {
		for (var i=0, ks=Object.keys(obj); i<ks.length; ++i) {
			this.ops.push({f: fcn, a: [ks[i], obj[ks[i]]]})
		}
		return this
	},

	_config: function(any) {
		var cProto = this.Co.prototype
		if (any != null) {

			if (typeof any === 'function') this.ops.push({f: any, a:[]})

			else if (any.constructor === Object) {
				for (var i=0, ks=Object.keys(any); i<ks.length; ++i) {
					var key = ks[i]
					if (!this[key]) throw Error (key + ' is not a template method')

					if (key[key.length-1] === 's' && any[key].constructor === Object) {
						// break group functions extras, props, attrs
						this._ops(cProto[key.slice(0,-1)], any[key])
					}
					else {
						this.ops.push({f: cProto[key], a:[any[key]]})
					}
				}
			}
			else if (cProto.append) this.ops.push({f: cProto.append, a: [any]})
			else throw Error('invalid argument '+any)
		}
		return this
	},

	extra: wrapMethod('extra'),
	extras: wrapMany('extra'),

	// ELEMENT OPERATIONS

	attr: wrapMethod('attr'),
	attrs: wrapMany('attr'),

	event: wrapMethod('event'),
	events: wrapMany('event'),

	prop: wrapMethod('prop'),
	props: wrapMany('prop'),

	class: wrapMethod('class'),
	append: wrapMethod('append')
}

function wrapMany(name) {
	return function(a) {
		return this._clone([])._ops(this.Co.prototype[name], a)
	}
}

function wrapMethod(name) {
	return function() {
		for (var i=0, args=[]; i<arguments.length; ++i) args[i] = arguments[i]
		return this._clone({f: this.Co.prototype[name], a: args})
	}
}

function run(op, ctx) {
	return op.f.apply(ctx, op.a)
}
