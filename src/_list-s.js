import {ListK} from './_list-k'
import {D} from './document'
import {assignToThis} from './object'

/**
 * @constructor
 * @param {!Object} template
 * @param {Object} [options]
 */
export function ListS(template, options) {
	this._init(template, options)

	for (var i=0, ks=Object.keys(template); i<ks.length; ++i) {
		var key = ks[i],
				model = template[ks[i]]
		this._items[ks[i]] = (model.cloneNode ? model.cloneNode(true)
			: model.defaults({common: this.common, key: key}).create())
	}
}

ListS.prototype = {
	constructor: ListS,
	common: null,
	assign: assignToThis,
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
}

function updateListChildren(v,k,o) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
			spot = this.head.nextSibling,
			items = this._items,
			keys = this.select(v,k,o)

	for (var i=0; i<keys.length; ++i) {
		var item = items[keys[i]]
		if (item) {
			if (item.update) item.update(v,k,o)
			spot = this._placeItem(parent, item, spot).nextSibling
		}
	}

	if (spot !== foot) while (spot !== parent.removeChild(foot.previousSibling)) {} //eslint-disable-line no-empty
	return this
}
