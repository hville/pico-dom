import {List} from './List'
import {initChild} from './initChild'

/**
 * @constructor
 * @extends List
 * @param {Object} model model
 */
export function ListK(model) {
	List.call(this, model)
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
			var item = newM[key] = items[key] || initChild(this.template, {
				store: this.store,
				state: this.state,
				key: key
			})
			if (item) {
				if (item.update) item.update(arr[i], i, arr)
				spot = this._placeItem(parent, item, spot).nextSibling
			}
		}

		this._items = newM
		return spot
	}}
})
