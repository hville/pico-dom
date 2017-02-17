var G = require('./util/root'),
		getChildItems = require('./util/get-child-items')

module.exports = Fragment

function Fragment(content, cfg) {
	this.content = getChildItems(content)
	//required to keep parent ref when no children.length === 0
	this.footer = G.document.createComment('$')
	this.content.push(this.footer)
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
	isFragment: true,
	key: '',
	kinIndex: NaN,
	get length() { return this.content.length - 1 },
	get parentNode() { return this.footer.parentNode },
	//get previousSibling() { return this.content[0].previousSibling },
	//get nextSibling() { return this.footer.nextSibling },
	dataKey: function getIndex(v,i) { return i },
	oninit: null,
	ondata: function ondata(a,b,c) {
		var content = this.content
		for (var i=0; i<content.length; ++i) if (content[i].ondata) content[i].ondata(a,b,c)
	},
	onmove: null,
	moveBefore: function moveBefore(parent, before) {
		var content = this.content,
				i = content.length
		while (i--) {
			var child = content[i].el || content[i]
			if (child !== before) before = child.moveBefore ? child.moveBefore(parent, before) : parent.insertBefore(child, before || null)
		}
		//if (this.onmove) this.onmove(oldParent, parent) //TODO
		return before
	}
}
