var G = require('./util/root'),
		getChildItems = require('./util/get-child-items')

module.exports = Fragment

function Fragment(content, cfg) { //TODO no Config?
	this.content = getChildItems(content)
	//required to keep parent ref when no children.length === 0
	this.footer = G.document.createComment('$')
	this.content.push(this.footer)
	//TODO reduce(cfg, assign, this)
	if (cfg) {
		//lifecycle hooks
		if (cfg.ondata) this.ondata = cfg.ondata
		if (cfg.onmove) this.onmove = cfg.onmove
		if (cfg.oninit) {
			this.oninit = cfg.oninit
			this.oninit(cfg)
		}
	}
}
Fragment.prototype = {
	constructor: Fragment,
	get length() { return this.content.length - 1 },
	get parentNode() { return this.footer.parentNode },
	dataKey: function getIndex(v,i) { return i },
	oninit: null,
	ondata: function ondata(a,b,c) {
		var content = this.content
		for (var i=0; i<content.length; ++i) if (content[i].ondata) content[i].ondata(a,b,c)
	},
	onmove: null,
	moveto: function moveto(parent, before) {
		var oldParent = this.parentNode,
				content = this.content,
				i = content.length
		while (i--) {
			var child = content[i].node || content[i]
			if (child !== before) before = child.moveto ? child.moveto(parent, before) : parent.insertBefore(child, before || null)
		}
		if (this.onmove) this.onmove(oldParent, parent)
		return before //last insertedChild || first fragmentElement
	}
}
