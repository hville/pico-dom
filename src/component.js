var getChild = require('create-element-ns/src/get-child'),
		event = require('./event'),
		global = require('dom-document')

module.exports = Component

function Component(elm, cfg, cnt) {
	// internal temporary node used to position updates. shared across all nodes
	if (!this.placeholder) this.placeholder = global.document.createComment('placeholder')

	this.el = elm
	this.key = cfg.key
	this.eventHandlers = {}
	this.content = getContent(cnt)
	if (cfg.on) this.on(cfg.on)

	//lifecycle hooks
	this.oninit = cfg.oninit || noop // (cfg) => void
	this.ondata = cfg.ondata || noop // (data[, childIndex]) => data'
	this.oninit(cfg)
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

	// the element edit function may change the value to pass down
	var xval = this.ondata(val, idx)
	if (xval === undefined) xval = val
	if (cnt && cnt.length) this.updateChildren(xval, 0)

	// mount the group if a target is provided
	if (after && elm.parentNode !== after.parentNode) {
		after.parentNode.insertBefore(elm, after.nextSibling)
	}
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
	var tgt = []
	if (src) for (var i=0; i<src.length; ++i) {
		var child = getChild(src[i])
		if (child) tgt.push(child)
	}
	return tgt
}
function noop() {}
