import {ListK} from './_list-k'
import {D} from './document'
import {picoKey} from './picoKey'

/**
 * @constructor
 * @param {!Object} template
 */
export function ListS(template) {
	this.template = template
	this.refs = {}
	this.node = D.createComment('^')
	this.foot = D.createComment('$')
	this.node[picoKey] = this

	for (var i=0, ks=Object.keys(template); i<ks.length; ++i) {
		var key = ks[i],
				model = template[ks[i]]
		this.refs[ks[i]] = model.create(this, key)
	}
}

var protoK = ListK.prototype
ListS.prototype = {
	constructor: ListS,
	root: null,
	onremove: null,
	ondestroy: null,

	extra: protoK.extra,
	moveTo: protoK.moveTo,
	remove: protoK.remove,
	destroy: protoK.destroy,
	_placeItem: protoK._placeItem,

	/**
	 * select all by default
	 * @function
	 * @param {...*} [v]
	 * @return {!Array}
	 */
	select: function(v) { return Object.keys(this.refs) }, //eslint-disable-line no-unused-vars

	update: updateListChildren,
	updateChildren: updateListChildren
}

function updateListChildren(v,k,o) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
			spot = this.node.nextSibling,
			items = this.refs,
			keys = this.select(v,k,o)
	if (this.node.parentNode !== foot.parentNode) throw Error('selectlist update parent mismatch')

	for (var i=0; i<keys.length; ++i) {
		var item = items[keys[i]]
		if (item) {
			if (item.update) item.update(v,k,o)
			spot = this._placeItem(parent, item, spot, foot).nextSibling
		}
	}
	while(spot !== this.foot) {
		item = spot[picoKey]
		spot = (item.foot || item.node).nextSibling
		item.remove()
	}
	return this
}
