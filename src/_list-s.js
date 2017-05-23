import {ListK} from './_list-k'
import {D} from './document'
import {assignToThis} from './object'

/**
 * @constructor
 * @param {!Object} template
 * @param {Object} [options]
 */
export function ListS(template) {
	this._init(template)

	for (var i=0, ks=Object.keys(template); i<ks.length; ++i) {
		var key = ks[i],
				model = template[ks[i]]
		this._items[ks[i]] = (model.cloneNode ? model.cloneNode(true)
			: model.create({common: this.common, key: key}))
	}
}

ListS.prototype = {
	constructor: ListS,
	common: null,
	assign: assignToThis, //TODO needed?
	_init: ListK.prototype._init,
	moveTo: ListK.prototype.moveTo,

	/**
	 * select all by default
	 * @function
	 * @param {...*} [v]
	 * @return {!Array}
	 */
	select: function(v) { return Object.keys(this._items) }, //eslint-disable-line no-unused-vars

	update: updateListChildren,
	updateChildren: updateListChildren,
	_placeItem: ListK.prototype._placeItem,
	_childTemplate: ListK.prototype._childTemplate
}

function updateListChildren(v,k,o) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
			spot = this.node.nextSibling,
			items = this._items,
			keys = this.select(v,k,o)
	if (this.node.parentNode !== foot.parentNode) throw Error('selectlist update parent mismatch')

	for (var i=0; i<keys.length; ++i) {
		var item = items[keys[i]]
		if (item) {
			if (item.update) item.update(v,k,o)
			spot = this._placeItem(parent, item, spot).nextSibling //TODO
		}
	}

	if (spot !== foot) while (spot !== parent.removeChild(foot.previousSibling)) {} //eslint-disable-line no-empty
	return this
}
