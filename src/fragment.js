var insertBefore = require('./el/insert-before'),
		G = require('./util/root')

module.exports = Fragment

function Fragment(content, cfg) {
	this.content = content //TODO validate content. currently accepts elements and instances only
	this.header = G.document.createComment('^') //required to keep parent ref when content.length === 0
	//this.footer = G.document.createComment('$') //required to keep parent ref when content.length === 0
	if (cfg) {
		if (cfg.key) this.key = cfg.key
		if (cfg.kinIndex) this.kinIndex = cfg.kinIndex
		//lifecycle hooks
		if (cfg.ondata) this.ondata = cfg.ondata
		if (cfg.oninit) {
			this.oninit = cfg.oninit
			this.oninit(cfg)
		}
	}
}
Fragment.prototype = {
	constructor: Fragment,
	key: '',
	kinIndex: NaN,
	get parent() { return this.header.parentNode },
	get firstKin() { //TODO changetofirstElement
		var itm = this.content[0]
		if (!itm) return null
		if (itm.el) return (itm.el)
		if (itm.content) return itm.firstKin
		return itm
	},
	get lastKin() { ////TODO changetolastElement
		var itm = this.content[this.content.length-1]
		if (!itm) return null
		if (itm.el) return (itm.el)
		if (itm.content) return itm.lastKin
		return itm
	},
	dataKey: function getIndex(v,i) { return i },
	oninit: null,
	ondata: function ondata(a,b,c) {
		var content = this.content
		for (var i=0; i<content.length; ++i) if (content[i].ondata) content[i].ondata(a,b,c)
	},
	moveTo: function moveTo(parent, before) {
		parent.insertBefore(this.header, before||null)
		return insertBefore(parent, this.content, before||null)
	},
/*	remove: function remove() {
		//TODO header, footer,,,
		//TODO remove from parent Component???
		var content = this.content,
				parent = this.parent
		for (var i=0; i<content.length; ++i) parent.removeChild(content[i].el || content[i])
	}*/
}
