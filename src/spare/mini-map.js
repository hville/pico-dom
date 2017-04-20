export function MiniMap() {}
MiniMap.prototype.get = function get(key) {
	return this[key]
}
MiniMap.prototype.set = function set(key, val) {
	this[key] = val
	return this
}
MiniMap.prototype.delete = function del(key) {
	delete this[key]
	return this
}
