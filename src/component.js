var createElement = require('create-element-ns/src/create-element'),
		decorate = require('create-element-ns/src/decorate'),
		is = require('create-element-ns/src/is'),
		event = require('./event'),
		global = require('dom-document')

module.exports = Component

function Component(cfg) {
	this.el = decorate(createElement(cfg), cfg)
	this.key = cfg.key
	this.eventHandlers = {}
	this.edit = cfg.edit
	this.content = getContent(cfg.content)
	if (cfg.on) this.on(cfg.on)
	// temporary node used to position updates. shared across all nodes
	if (!this.placeholder) this.placeholder = global.document.createComment('placeholder')
	// callback on instance
	if (cfg.init) cfg.init.call(this, cfg)
}
Component.prototype = {
	constructor: Component,
	on: event.on,
	handleEvent: event.handleEvent,
	view: view,
	updateChildren: updateChildren,
	placeholder: null
}
function view(val, idx, after) {
	var elm = this.el,
			cnt = this.content
	if (idx === undefined) idx = 0
	if (after && elm.parentNode !== after.parentNode) {
		after.parentNode.insertBefore(elm, after.nextSibling)
	}
	// the element edit function may change the value to pass down
	var xval = this.edit ? this.edit(val, idx) : val
	if (xval === undefined) xval = val
	if (cnt && cnt.length) this.updateChildren(xval, 0)
	return elm
}
function updateChildren(val, idx) {
	var elm = this.el,
			placeholder = this.placeholder,
			last = placeholder,
			cnt = this.content
	elm.insertBefore(last, elm.firstChild)
	for (var i=0; i<cnt.length; ++i) {
		var itm = cnt[i]
		last = (itm === last) ? last
			: itm.constructor === Function ? itm(val, idx+i, last)
			: elm.insertBefore(itm, last.nextSibling)
	}
	elm.removeChild(placeholder)
	while (last.nextSibling) elm.removeChild(last.nextSibling)
}
function getContent(src) {
	if (src) {
		var tgt = []
		for (var i=0; i<src.length; ++i) {
			var itm = src[i]
			if (is.node(itm)) tgt.push(itm.cloneNode(true))
			else if (is.stringlike(itm)) tgt.push(global.document.createTextNode(itm))
			else if (is.function(itm)) tgt.push(itm())
		}
		return tgt
	}
}
