import {ListK} from './_list-k'
import {D} from './document'
import {picoKey} from './picoKey'
import {setThis} from './set-this'

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

ListS.prototype = {
	constructor: ListS,
	root: null,
	extra: setThis,
	moveTo: ListK.prototype.moveTo,
	remove: ListK.prototype.remove,

	/**
	 * select all by default
	 * @function
	 * @param {...*} [v]
	 * @return {!Array}
	 */
	select: function(v) { return Object.keys(this.refs) }, //eslint-disable-line no-unused-vars

	update: updateListChildren,
	updateChildren: updateListChildren,
	_placeItem: ListK.prototype._placeItem,
	_clearFrom: ListK.prototype._clearFrom

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
	this._clearFrom(spot)
	return this
}
