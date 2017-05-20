export function Op(fcn, a, b) {
	this.f = fcn
	this.a = a
	this.b = b
}

Op.prototype = {
	call: function(ctx) {
		var op = this
		return op.b === undefined ? op.f.call(ctx, op.a) : op.f.call(ctx, op.a, op.b)
	}
}
