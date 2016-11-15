var CE = require('create-element-ns'),
		event = require('./event'),
		domAPI = require('dom-document')

module.exports = Component

function Component(sel, cfg, cnt) { //TODO PARSE MULTIPLE
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
			: itm.constructor === Function ? itm(val, idx+i, last)
			: elm.insertBefore(itm, last.nextSibling)
	}
	elm.removeChild(placeholder)
	while (last.nextSibling) elm.removeChild(last.nextSibling)
}
function setContent(cnt) {
	this.content = (Array.isArray(cnt)) ? cnt.reduce(parseContent, this.content)
		: parseContent(this.content, cnt)
}
function parseContent(res, cnt) {
	var d = domAPI.document
	if (!cnt && cnt !== 0) return res
	else if (cnt.nodeName && cnt.nodeType > 0) res.push(cnt.cloneNode(true))
	else if (cnt.constructor === Function) res.push(cnt())
	else if (cnt.constructor === String || cnt.constructor === Number) res.push(d.createTextNode(cnt))
	return res
}
