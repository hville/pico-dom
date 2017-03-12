module.exports = {
	oninit: lifecycle,
	ondata: lifecycle,
	onmove: lifecycle,
	on: addEventListeners, // events from config
	_eventHandlers: addEventListeners // events from cloned component
}
function lifecycle(ctx, fcn, key) {
	ctx[key] = fcn
	return ctx
}
function addEventListeners(ctx, obj) {
	ctx.on(obj)
	return ctx
}
