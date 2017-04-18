/*
map:   (this:La, ( a => b)) => Lb // L(path.concat( a=>b ))         map(fcn)
ap:    (this:La, L(a => b)) => Lb // L(path.concat(L(a=>b).path))   ap(lens)
chain: (this:La, (a => Lb)) => Lb // L(path.concat((a=>Lb).value))  chain(lens.of) //no need
*/

export function createLens(path, post, data) {
	return new Lens(
		Array.isArray(path) ? path : path != null ? [path] : [], //eslint-disable-line eqeqeq
		post,
		data
	)
}

export function Lens(path, post, data) {
	this.path = path
	this.post = post
	this.data = data
}

Lens.of = createLens

Lens.prototype = {
	constructor: Lens,
	get key() {
		return this.path[this.path.length - 1] //TODO fail on fcn
	},
	get: map,
	map: map,
	set: function(val) {
		this.post(this.path, val)
	},
	default: function() {
		return this.value(this.data)
	},
	value: function value(obj) {
		var val = obj,
				path = this.path
		for (var i=0; i<path.length; ++i) {
			var step = path[i]
			if (val.hasOwnProperty(step)) val = val[step]       // key
			else if (typeof key === 'function') val = step(val) // map //TODO step(val, key)
			// value = step.value(value)  // ap
			// value = step(value).value  // chain
			else return
		}
		return val
	},
	ap: function ap(lens) {
		return new Lens(this.path.concat(lens.path), this.post, this.data)
	}
}

function map() {
	var path = this.path
	return new Lens(path.concat.apply(path, arguments), this.post, this.data)
}
