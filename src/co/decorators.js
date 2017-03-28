var reduce = require('../util/reduce')

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
	reduce(obj, setEvt, ctx)
	return ctx
}
function setEvt(ctx, fcn, key) {
	ctx.setEvent(key, fcn)
	return ctx
}
