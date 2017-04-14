var counter = 0

export function PunyMap() {
	// unique key to avoid clashes between instances and other properties
	this._key = '_wMap' + String.fromCodePoint(Date.now()<<8>>>16) + (counter++).toString(36)
}
PunyMap.prototype.get = function get(objectKey) {
	return objectKey[this._key]
}
PunyMap.prototype.set = function set(objectKey, val) {
	objectKey[this._key] = val
	return this
}
