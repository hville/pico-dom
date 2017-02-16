var Fragment = require('./fragment'),
		event = require('./co/event')

module.exports = Component

function Component(elm, cfg, cnt) {
	this.el = elm
	this.on = {}
	if (cfg.key) this.key = cfg.key
	if (cfg.kinIndex) this.kinIndex = cfg.kinIndex
	if (cfg.on) this.listen(cfg.on)
	// children
	if (cnt) {
		this.children = new Fragment(cnt)
		this.children.moveTo(elm, null)
	}
	// lifecycle hooks
	if (cfg && cfg.ondata) this.ondata = cfg.ondata
	if (cfg && cfg.oninit) {
		this.oninit = cfg.oninit
		this.oninit(cfg)
	}
}
Component.prototype = {
	constructor: Component,
	key: '',
	kinIndex: NaN,
	oninit: null,
	children: null,
	listen: event.listen,
	handleEvent: event.handleEvent,
	ondata: function ondata(a,b,c) {
		this.children.ondata(a,b,c) //default pass-through
	}
}
