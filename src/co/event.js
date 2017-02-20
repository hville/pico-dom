var ctyp = require('../util/typ'),
		reduce = require('../util/reduce')

module.exports = {
	listen: listen,
	handleEvent: handleEvent
}

function listen(typ, fcn) {
	var el = this.node,
			handlers = this._eventHandlers,
			options = {capture: true, passive:true}
	switch (arguments.length) {
		case 2:
			if (!fcn) {
				delete handlers[typ]
				el.removeEventListener(typ, this, options)
			}
			else {
				handlers[typ] = fcn
				el.addEventListener(typ, this, options)
			}
			break
		case 1:
			if (ctyp(typ) === Object) reduce(typ, addListener, this)
			else return handlers[typ]
			break
		case 0:
			return Object.keys(handlers)
	}
	return this
}
// standard property called by window on event, binded to co
function handleEvent(evt) {
	var fcn = this._eventHandlers[evt.type]
	evt.stopPropagation()
	fcn.call(this, evt)
}
function addListener(ctx, val, key) {
	ctx.on(key, val)
	return this
}
