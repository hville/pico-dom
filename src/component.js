var CE = require('create-element-ns'),
		event = require('./event'),
		domAPI = require('dom-document')

module.exports = Component

function Component(cfg) { //TODO PARSE MULTIPLE
	this.el = CE.decorate(CE.createElement(cfg), cfg)
	this.key = cfg.key
	this.eventHandlers = {}
	this.edit = cfg.edit
	this.content = cfg.content
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
