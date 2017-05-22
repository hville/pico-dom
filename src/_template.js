import {each} from './object'
import {Op} from './_op'
import {D} from './document'


/**
 * @constructor
 * @param {!Object} constructor
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
		if (keyVal) cmp.assign(keyVal)
		for (var i=1; i<ops.length; ++i) ops[i].call(cmp)
		return cmp
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


	call: function(fcn) {
		return new Template(this.Co, this.ops.concat(new Op(call, fcn)))
	},

	_config: function(any) {
		if (any != null) {
			if (typeof any === 'function') this.ops.push(new Op(call, any))
			else if (any.constructor === Object) each(any, this.addTransform, this)
			else childOps.call(this, any)
		}
		return this
	},

	child: function() {
		return childOps.apply(
			new Template(this.Co, this.ops.slice()),
			arguments
		)
	},

	addTransform: function(argument, name) {
		var proto = this.Co.prototype
		if (!proto[name]) throw Error('invalid method name: ' + name)
		if (Array.isArray(argument)) this.ops.push(new Op(proto[name], argument[0], argument[1]))
		else this.ops.push(new Op(proto[name], argument))
	}
}


function call(fcn) {
	fcn.call(this, this.node)
}


function childOps() {
	var proto = this.Co.prototype
	for (var i=0; i<arguments.length; ++i) {
		var child = arguments[i]
		if (child != null) {
			if (Array.isArray(child)) childOps.apply(this, child)
			else this.ops.push(
				child.create ? new Op(proto._childTemplate, child)
				: child.cloneNode ? new Op(proto._childNode, child)
				: new Op(proto._childText, ''+child)
			)
		}
	}
	return this
}

function wrapMethod(name) {
	return function(a, b) {
		var proto = this.Co.prototype
		if (typeof proto[name] !== 'function') throw Error (name + ' is not a valid method for this template')
		return new Template(this.Co, this.ops.concat(new Op(proto[name], a, b)))
	}
}
