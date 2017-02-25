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
	on: addEventListeners, // events from config
	_eventHandlers: addEventListeners // events from cloned component
}
function addEventListeners(ctx, obj) {
	ctx.on(obj)
}
