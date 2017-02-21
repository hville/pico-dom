var W = require('../util/root'),
		getChildItems = require('../util/get-child-items'),
		decorate = require('../util/decorate'),
		decorators = require('./decorators')


module.exports = Fragment

function Fragment(content, cfg) { //TODO no Config?
	this.content = getChildItems(content) //TODOusedbyLi
	//required to keep parent ref when no children.length === 0
	this.header = W.document.createComment('^')
	this.footer = W.document.createComment('$') //TODOusedbyLi
	this.content.push(this.footer)
	decorate(this, cfg, decorators)
	if (this.oninit) this.oninit(cfg)
}
Fragment.prototype = {
	constructor: Fragment,
	get length() { return this.content.length - 1 },
	item: function item(i) { return this.content(i) },
	forEach: function forEach(fcn, ctx) { //TODOusedbyCo
		for (var i=0; i<this.content.length-1; ++i) fcn.call(ctx||null, this.content[i], i, this.content)
	},
	get parentNode() { return this.footer.parentNode }, //TODOusedbyLi
	moveto: function moveto(parent, before) { //TODOusedbyCo //TODOusedbyLi
		var content = this.content,
				i = content.length
		while (i--) {
			var child = content[i].node || content[i]
			if (child !== before) before = child.moveto ? child.moveto(parent, before) : parent.insertBefore(child, before || null)
		}
		return before //last insertedChild || first fragmentElement
	}
}
