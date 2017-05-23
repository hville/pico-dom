/**
 * @constructor
 * @param {Function} method
 * @param {*} [a]
 * @param {*} [b]
 */
export function Op(method, a, b) {
	this.f = method
	this.a = a
	this.b = b
}

Op.prototype.call = function(ctx) {
	var op = this
	return !op.f ? op.a
		: op.b === undefined ? op.f.call(ctx, op.a)
		: op.f.call(ctx, op.a, op.b)
}
