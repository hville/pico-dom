var CE = require('create-element-ns'),
		event = require('./event'),
		domAPI = require('dom-document')

var mergeKeys = CE.mergeKeys

module.exports = Component

function Component(sel, cfg, cnt) {
	if (!cfg) cfg = {}
	this.el = CE.el(sel, cfg)
	this.key = cfg.key
	this.eventHandlers = {}
	this.edit = cfg.edit
	this.content = []
	if (cnt || cnt === 0) this.setContent(cnt)
	if (cfg.on) this.on(cfg.on)
	// temporary node used to position updates. shared across all nodes
	if (!this.placeholder) this.placeholder = domAPI.document.createComment('placeholder')
	// callback on instance
	this.init = cfg.init
	if (this.init) this.init(cfg)
}
Component.prototype = {
	constructor: Component,
	isComponent: isComponent,
	clone: clone,
	on: event.on,
	handleEvent: event.handleEvent,
	view: view,
	updateChildren: updateChildren,
	setContent: setContent,
	placeholder: null
}
function isComponent(o) {
	return (o && o.constructor) === Component
}
function clone(cfg) {
	var co = new Component(
		this.el.cloneNode(true),
		mergeKeys({
			on: this.eventHandlers,
			edit: this.edit,
			init: this.init,
			key: this.key
		}, cfg),
		this.content.map(cloneChild)
	)
	if (cfg) {
		var decorators = CE.decorators
		for (var k in cfg) {
			if (decorators[k]) decorators[k].call(cfg, co.el, k, cfg[k])
		}
	}
	return co
}
function cloneChild(c) {
	return isComponent(c) ? c.clone()
		: CE.is.node(c) ? c.cloneNode(true)
		: c
}
function view(val, idx, after) {
	var elm = this.el
	if (idx === undefined) idx = 0
	if (after && elm.parentNode !== after.parentNode) {
		after.parentNode.insertBefore(elm, after.nextSibling)
	}
	// the element edit function may change the value to pass down
	var xval = this.edit ? this.edit(val, idx) : val
	if (xval === undefined) xval = val
	if (this.content.length) this.updateChildren(xval, 0)
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
			: itm.view ? itm.view(val, idx+i, last)
			: itm.isView ? itm(val, idx+i, last)
			: elm.insertBefore(itm, last.nextSibling)
	}
	elm.removeChild(placeholder)
	while (last.nextSibling) elm.removeChild(last.nextSibling)
}
function setContent(cnt) {
	var content = this.content
	content.length = 0
	content = (Array.isArray(cnt)) ? cnt.reduce(parseContent, content)
		: parseContent(content, cnt)
}
function parseContent(res, cnt) {
	var d = domAPI.document

	if (!cnt && cnt !== 0) return res
	else if (cnt.nodeName && cnt.nodeType > 0) res.push(cnt)
	else if (cnt.isView || cnt.view) res.push(cnt)
	else if (cnt.isFactory) res.push(cnt())
	else if (cnt.constructor === String || cnt.constructor === Number) res.push(d.createTextNode(cnt))
	return res
}
