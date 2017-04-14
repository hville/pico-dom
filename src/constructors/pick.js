export function Pick(path) {
	this.path = path
}
Pick.of = Pick['fantasy-land/of'] = function of() {
	return new Pick(Array.apply(null, arguments))
}
Pick.prototype = {
	constructor: Pick,
	get value() {
		return
	},
	key: map,
	map: map,
	apply: function apply(obj) {
		var value = obj,
				path = this.path
		for (var i=0; i<path.length; ++i) {
			var step = path[i]
			if (value.hasOwnProperty(step)) value = value[step]     // key
			else if (typeof key === 'function') value = step(value) // map
			// value = step.value(value)  // ap
			// value = step(value).value  // chain
			else return
		}
		return value
	},
	ap: function ap(pick) {
		return new Pick(this.path.concat(pick.path))
	},
	chain: function chain(f) {
		return f(this.path)
	}
}
function map() {
	return new Pick(this.path.concat.apply(this.path, arguments))
}
