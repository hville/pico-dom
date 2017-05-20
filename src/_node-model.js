import {NodeCo, ncProto} from './_node-co'
import {each} from './object'
import {Op} from './_op'
import {D} from './document'



/**
 * @constructor
 * @param {Node} node - DOM node
 * @param {Array} [transforms] - configuration
 */
export function NodeModel(node, transforms) {
	this.node = node
	this.ops = transforms || []
}

NodeModel.prototype = {
	constructor: NodeModel,

	assign: function(key, val) {
		return new NodeModel(this.node, this.ops.concat(new Op(ncProto.assign, key, val)))
	},

	create: function(keyVal) {
		var co = new NodeCo(this.node.cloneNode(true)),
				ops = this.ops
		if (keyVal) co.assign(keyVal)
		for (var i=0; i<ops.length; ++i) ops[i].call(co)
		return co
	},

	on: function(name, handler) {
		return new NodeModel(this.node, this.ops.concat(new Op(ncProto.on, name, handler)))
	},

	attr: function(name, value) {
		return new NodeModel(this.node, this.ops.concat(new Op(ncProto.attr, name, value)))
	},

	prop: function(key, val) {
		return new NodeModel(this.node, this.ops.concat(new Op(ncProto.prop, key, val)))
	},

	class: function(name) {
		return new NodeModel(this.node, this.ops.concat(new Op(ncProto.class, name)))
	},

	call: function(fcn) {
		return new NodeModel(this.node, this.ops.concat(new Op(call, fcn)))
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
		return new NodeModel(this.node, childOps.apply(this.ops.slice(), arguments))
	},

	addTransform: function(argument, name) {
		if (Array.isArray(argument)) this.ops.push(new Op(ncProto[name], argument[0], argument[1]))
		else this.ops.push(new Op(ncProto[name], argument))
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

function identity(node) {
	return node
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
