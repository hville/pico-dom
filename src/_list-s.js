import {List} from './_list'


/**
 * @constructor
 * @this {List}
 * @param {!Object} template
 * @param {Object} [options]
 */
export function ListS(template, options) {
	List.call(this, template, options)

	for (var i=0, ks=Object.keys(template); i<ks.length; ++i) {
		this._items[ks[i]] = this._initChild(template[ks[i]], ks[i])
	}
}


ListS.prototype = Object.create(List.prototype, {
	select: {
		/**
		 * select all by default
		 * @function
		 * @param {...*} [v]
		 * @return {!Array}
		 */
		value: function(v) { return Object.keys(this._items) }, //eslint-disable-line no-unused-vars
		writable: true
	},
	_updateChildren: {value: function(v,k,o) {
		var spot = this.head.nextSibling,
				parent = spot.parentNode,
				items = this._items,
				keys = this.select(v,k,o)

		for (var i=0; i<keys.length; ++i) {
			var item = items[keys[i]]
			if (item) {
				if (item.update) item.update(v,k,o)
				spot = this._placeItem(parent, item, spot).nextSibling
			}
		}

		return spot
	}}
})
