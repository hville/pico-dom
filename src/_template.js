import {D} from './document'
import {Component} from './_component'
import {Op} from './_op'

/**
 * @constructor
 * @param {Array} [transforms] - configuration
 */
export function Template(transforms) {
	this.ops = transforms
}


Template.prototype = {
	constructor: Template,

	create: function(root, key) {
		var ops = this.ops,
				cmp = new Component(ops[0].call(D), root, key)
		for (var i=1; i<ops.length; ++i) ops[i].call(cmp)
		return cmp
	},

	class: function(name) {
		return new Template(this.ops.concat(new Op(setAttribute, 'class', name)))
	},

	attr: function(name, value) {
		return new Template(this.ops.concat(new Op(setAttribute, name, value)))
	},

	prop: function(key, val) {
		return new Template(this.ops.concat(new Op(setProperty, key, val)))
	},

	child: function() {
		var ops = this.ops.slice()
		for (var i=0; i<arguments.length; ++i) {
			var child = arguments[i]
			if (child != null) ops.push(
				child.create ? new Op(appendTemplate, child)
				: child.cloneNode ? new Op(appendChild, child)
				: new Op(appendText, ''+child)
			)
		}
		return new Template(ops)
	},

	key: function(key) {
		return new Template(this.ops.concat(new Op(setKey, key)))
	},

	assign: function(key, val) {
		return new Template(this.ops.concat(new Op(assign, key, val)))
	}
}

function setKey(key) { //move to create???
	this.key = key
	this.root.refs[key] = this
}

function assign(key, val) {
	this.comp[key] = val
}

function setAttribute(key, val) {
	if (val === false) this.node.removeAttribute(key)
	else this.node.setAttribute(key, val === true ? '' : val)
}

function setProperty(key, val) {
	if (this.node[key] !== val) this.node[key] = val
}

function appendChild(node) {
	this.node.appendChild(node.cloneNode(true))
}

function appendTemplate(template) {
	this.node.appendChild(template.create(this.comp).node)
}

function appendText(txt) {
	this.node.appendChild(D.createTextNode(txt))
}
