//import {NodeCo, ncProto} from './_node-co'
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

	call: function(fcn) {
		return new Template(this.Co, this.ops.concat(new Op(call, fcn)))
	},

	_config: function(any) {
		if (any != null) {
			if (typeof any === 'function') this.ops.push(new Op(call, any))
			else if (any.constructor === Object) each(any, this.addTransform, this)
			else childOps.call(this.ops, any)
		}
		return this
	},

	child: function() {
		return new Template(this.Co, childOps.apply(this.ops.slice(), arguments))
	},

	addTransform: function(argument, name) {
		var proto = this.Co.prototype
		if (!proto[name]) throw Error('invalid method name: ' + name)
		if (Array.isArray(argument)) this.ops.push(new Op(proto[name], argument[0], argument[1]))
		else this.ops.push(new Op(proto[name], argument))
	}
}

function appendChild(node) { //mode to co._appendXXX
	this.node.appendChild(node.cloneNode(true))
}

function appendTemplate(template) { //mode to co._appendXXX
	template.create({common: this.common}).moveTo(this.node)
}

function appendText(txt) { //mode to co._appendXXX
	this.node.appendChild(D.createTextNode(txt))
}

function call(fcn) {
	fcn.call(this, this.node)
}


function childOps() {
	for (var i=0; i<arguments.length; ++i) {
		var child = arguments[i]
		if (child != null) {
			if (Array.isArray(child)) childOps.apply(this, child)
			else this.push(
				child.create ? new Op(appendTemplate, child)
				: child.cloneNode ? new Op(appendChild, child)
				: new Op(appendText, ''+child)
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
