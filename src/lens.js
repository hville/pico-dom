/*
map:   (this:La, ( a => b)) => Lb // L(path.concat( a=>b ))         map(fcn)
ap:    (this:La, L(a => b)) => Lb // L(path.concat(L(a=>b).path))   ap(lens)
chain: (this:La, (a => Lb)) => Lb // L(path.concat((a=>Lb).value))  chain(lens.of) //no need
*/

export function createLens(set, key) {
	return new Lens(set, Array.isArray(key) ? key : key != null ? [key] : []) //eslint-disable-line eqeqeq
}

export function Lens(set, path) {
	this.set = set
	this.path = path || []
}

Lens.of = createLens

Lens.prototype = {
	constructor: Lens,
	get key() {
		return this.path[this.path.length - 1] //TODO fail on fcn
	},
	set: null,
	map: function map() {
		var path = this.path.slice()
		for (var i=0; i<arguments.length; ++i) path.push(arguments[i])
		return new Lens(this.set, path)
	},
	get: function get(obj) {
		var val = obj,
				path = this.path
		for (var i=0; i<path.length; ++i) {
			var key = path[i]
			if (val[key] !== undefined) val = val[key]       // key
			else if (typeof key === 'function') val = key(val) // map //TODO step(val, key)
			else return
		}
		return val
	},
	ap: function ap(lens) {
		return new Lens(this.set, this.path.concat(lens.path))
	}
}
