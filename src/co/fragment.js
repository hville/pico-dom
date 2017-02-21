var W = require('../util/root'),
		getChildItems = require('../util/get-child-items'),
		decorate = require('../util/decorate'),
		decorators = require('./decorators')


module.exports = Fragment

function Fragment(content, cfg) { //TODO no Config?
	this.content = getChildItems(content)
	//required to keep parent ref when no children.length === 0
	this.footer = W.document.createComment('$')
	this.content.push(this.footer)
	decorate(this, cfg, decorators)
	if (this.oninit) this.oninit(cfg)
}
Fragment.prototype = {
	constructor: Fragment,
	get length() { return this.content.length - 1 },
	get parentNode() { return this.footer.parentNode },
	dataKey: function getIndex(v,i) { return i },
	oninit: null,
	ondata: function ondata() {
		var content = this.content
		for (var i=0; i<content.length; ++i) if (content[i].ondata) content[i].ondata.apply(content[i], arguments)
	},
	view: function() {
		this.ondata.apply(this, arguments)
		return this.node
	},
	moveto: function moveto(parent, before) {
		var content = this.content,
				i = content.length
		while (i--) {
			var child = content[i].node || content[i]
			if (child !== before) before = child.moveto ? child.moveto(parent, before) : parent.insertBefore(child, before || null)
		}
		return before //last insertedChild || first fragmentElement
	}
}
