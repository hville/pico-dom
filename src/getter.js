export function getter(key) {
	return new Getter(Array.isArray(key) ? key : key != null ? [key] : []) //eslint-disable-line eqeqeq
}

export function Getter(path) {
	this.path = path || []
}

var pGetter = Getter.prototype

pGetter.map = function() {
	var path = this.path.slice()
	for (var i=0; i<arguments.length; ++i) path.push(arguments[i])
	return new Getter(path)
}
pGetter.value = function(obj) {
	var val = obj,
			path = this.path
	for (var i=0; i<path.length; ++i) {
		var key = path[i]
		if (val[key] !== undefined) val = val[key]       // key
		else if (typeof key === 'function') val = key(val) // map //TODO step(val, key)
		else return
	}
	return val
}
