var ctyp = require('../util/typ'),
		reduce = require('../util/reduce')

module.exports = {
	listen: listen,
	handleEvent: handleEvent
}

function listen(typ, fcn) {
	var el = this.el,
			handlers = this.on,
			options = {capture: true, passive:true}

	if (ctyp(typ) === Object) {
		reduce(typ, addListener, this)
	}
	else if (!fcn) {
		delete handlers[typ]
		el.removeEventListener(typ, this, options)
	}
	else {
		handlers[typ] = fcn
		el.addEventListener(typ, this, options)
	}
	return this
}
// standard property called by window on event, binded to co
function handleEvent(evt) {
	var fcn = this.on[evt.type]
	evt.stopPropagation()
	fcn.call(this, evt)
}
function addListener(ctx, val, key) {
	return ctx.listen(key, val)
}
