function lifecycle(key) {
	return function(ctx, fcn) {
		ctx[key] = fcn
		return ctx
	}
}
module.exports = {
	oninit: lifecycle('oninit'),
	ondata: lifecycle('ondata'),
	onmove: lifecycle('onmove'),
	on: function on(ctx, obj) { ctx.on(obj) }
}
