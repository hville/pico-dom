import {List} from './List'

/**
 * @constructor
 * @this {List}
 * @param {!Object} template
 * @param {Object} [options]
 */
export function ListK(template, options) {
	List.call(this, template, options)
}

ListK.prototype = Object.create(List.prototype, {
	getKey: {
		value: function(v,k) { return k }, // default: indexed
		writable: true
	},
	_updateChildren: {value: function(arr) {
		var spot = this.head.nextSibling,
				parent = spot.parentNode,
				items = this._items,
				newM = {}
		for (var i=0; i<arr.length; ++i) {
			var key = this.getKey(arr[i], i, arr)
			var item = newM[key] = items[key] || this._initChild(this._template, key)
			if (item) {
				if (item.update) item.update(arr[i], i, arr)
				spot = this._placeItem(parent, item, spot).nextSibling
			}
		}

		this._items = newM
		return spot
	}}
})
