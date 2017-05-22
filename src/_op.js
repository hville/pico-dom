export function Op(fcn, a, b) {
	this.f = fcn
	this.a = a
	this.b = b
}

Op.prototype = {
	call: function(ctx) {
		var op = this
		return !op.f ? op.a
			: op.b === undefined ? op.f.call(ctx, op.a)
			: op.f.call(ctx, op.a, op.b)
	}
}

export function Ops() {
	this.ops = []
}

Ops.prototype = {
	constructor: Ops,
	run: function(ctx) {
		var ops = this.ops,
				res = ctx
		for (var i=0; i<ops.length; ++i) {
			var op = ops[i]
			res = (op.b === undefined ? op.f.call(res, op.a) : op.f.call(res, op.a, op.b)) || res
		}
		return res
	},
	add: function(f, a, b) {
		this.ops.push(new Op(f, a, b))
	}
}
