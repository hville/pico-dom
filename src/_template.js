import {D} from './document'


/**
 * @constructor
 * @param {!Function} constructor
 * @param {!Array} transforms
 */
export function Template(constructor, transforms) {
	this.Co = constructor
	this.ops = transforms
}

export var TemplateProto = Template.prototype = {
	constructor: Template,

	create: function(parent, key) {
		var ops = this.ops,
				cmp = new this.Co(ops[0].f ? ops[0].f.apply(D, ops[0].a) : ops[0].a[0])

		if (parent) cmp.root = parent.root || parent
		else if (!cmp.refs) cmp.refs = {}

		if (key !== undefined) cmp.key = key

		for (var i=1; i<ops.length; ++i) ops[i].f.apply(cmp, ops[i].a)
		return cmp
	},

	call: function(fcn) {
		for (var i=1, args=[]; i<arguments.length; ++i) args[i-1] = arguments[i]
		return new Template(this.Co, this.ops.concat({f: fcn, a:args}))
	},

	text: wrapMethod('text'),
	extra: wrapMethod('extra'),
	prop: wrapMethod('prop'),
	attr: wrapMethod('attr'),
	class: wrapMethod('class'),
	event: wrapMethod('event'),

	append: wrapMethod('append'),

	_config: function(any) {
		var cProto = this.Co.prototype
		if (any != null) {

			// transform
			if (typeof any === 'function') this.ops.push({f: any, a:[]})

			// options
			else if (any.constructor === Object) {
				for (var i=0, ks=Object.keys(any); i<ks.length; ++i) {
					var methodName = ks[i],
							arg = any[ks[i]]

					// text, class
					if (this[methodName] && cProto[methodName]) this.ops.push({f: cProto[methodName], a:[arg]})

					// extra(s), prop(s), attr(s), event(s)
					else if (methodName[methodName.length-1] === 's' && this[methodName = methodName.slice(0,-1)] && cProto[methodName]) {
						for (var j=0, kks=Object.keys(arg); j<kks.length; ++j) this.ops.push(
							{f: cProto[methodName], a: [kks[j], arg[kks[j]]]}
						)
					}
					// none of the above
					else throw Error (ks[i] + ' is not a template method')
				}
			}

			// child
			else if (cProto.append) this.ops.push({f: cProto.append, a: [any]})
			else throw Error('invalid argument '+any)
		}
		return this
	}
}

function wrapMethod(name) {
	return function() {
		var cProto = this.Co.prototype
		for (var i=0, args=[]; i<arguments.length; ++i) args[i] = arguments[i]
		if (!cProto[name]) throw Error (name + ' is not a template method')
		return new Template(this.Co, this.ops.concat({f: cProto[name], a: args}))
	}
}
