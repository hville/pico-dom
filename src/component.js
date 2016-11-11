var createElementNS = require('create-element-ns'),
		event = require('./event'),
		domAPI = require('dom-document')

var document = domAPI.document

module.exports = Component

function Component(sel, cfg, cnt) {
	this.el = createElementNS(sel, cfg)
	//this.key = cfg && cfg.key
	this.eventHandlers = {}
	this.content = []
	this.updateSelf = cfg.update
	// init
	if (cfg && cfg.on) this.on(cfg.on)
	if (Array.isArray(cnt)) cnt.forEach(parseContent, this)
	else parseContent.call(this, cnt)
}
Component.prototype = {
	constructor: Component,
	isComponent: isComponent,
	clone: clone,
	on: event.on,
	handleEvent: event.handleEvent,
	update: update,
	updateChildren: updateChildren
}
function isComponent(o) {
	return (o && o.constructor) === Component
}
function clone(cfg) {
	var co = new Component(this.el.cloneNode(false), Object.assign({on: this.eventHandlers}, this, cfg), this.children.slice())
	if (co.el.id) co.el.removeAttribute('id')
	return co
}
function update(val, idx, ptr) {
	var content = this.content
	if (this.updateSelf) this.updateSelf(val, idx)
	// TODO any transmutation ??? newVal = this.updateSelf(val, idx)
	if (content.length) this.updateChildren(val, idx)
	return ptr
}
function updateChildren(val, idx) {
	var elm = this.el
	if (!elm.hasChildNodes()) elm.textContent = '.' //dummy placer node

	var ptr = elm.firstChild,
			cnt = this.content

	for (var i=0; i<cnt.length; ++i) {
		var itm = cnt[i]
		if (itm.update) ptr = itm.update(val, idx+i, ptr)
		else if (itm === ptr) ptr = ptr.nextSibling
		else elm.insertBefore(itm, ptr)
	}
	while (ptr) {
		var next = ptr.nextSibling
		elm.removeChild(ptr)
		ptr = next
	}
}
function parseContent(cnt) {
	var content = this.content,
			textNode = document.createTextNode
	if (!cnt) {
		if (cnt === 0) content.push(textNode('0'))
	}
	else if (cnt.nodeName && cnt.nodeType > 0) content.push(cnt)
	else if (cnt.isUpdate) content.push(cnt)
	else if (cnt.isFactory) content.push(cnt())
	else if (cnt.constructor === String || cnt.constructor === Number) content.push(textNode(cnt))
}
