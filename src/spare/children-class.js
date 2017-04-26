import {extras} from './extras'
/*
after||null, before||null
	~ need parent
	+ works with all
		+ children = new Children(anyNode)
		~ fragment = new Children(???, comment1, comment2) //need documentFragment
	- after|before might move||change
after||null>comment, comment<before||null
	~ need parent
	+ works with all
		+ children = new Children(anyParentNode)
		~ fragment = new Children(documentFragment)
	- after|before might move||change
first||null, before||null
	+ no parent
	+ works with all
		+ children = new Children(parent.firstChild)
		- fragment = new Children(comment1.nextSibling, comment2)
	- before might move||change

headCommentOnly:
	this.head
	get this.previousSibling
	this.nextSibling

*/
function Children(parent, after, before) {
	this.parent = parent
	if (after) this.head = after
	if (before) this.foot = before
}

var cProto = Children.prototype

cProto.head = null
cProto.foot = null

cProto.forEach = function(fcn, ctx) {
	var parent = this.parent,
			after = this.after
	if (parent) {
		var cursor = after ? after.nextSibling : parent.firstChild,
				index = 0
		while (cursor != this.before) { //eslint-disable-line eqeqeq
			fcn.call(ctx||this, cursor, index++)
			cursor = (extras.get(cursor) || cursor).nextSibling
		}
	}
	return this
}

cProto.update = function(v,k,o) {
	this.forEach(function(child) { extras.get(child).update(v,k,o)})
}

cProto.replace = function(children) {}
cProto.clear = function() {}

/*
forEach(fcn, ctx)        ~~> fcn.call(ctx, child, i)
reduce(fcn, result, ctx) ~~> fcn.call(ctx, result, child, i)
onEach(fcn, a,b,c)       ~~> fcn.call(child, a,b,c)
repeat(fcn, a,b,c)       ~~> fcn.call(child, a,b,c)
*/
