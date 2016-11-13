module.exports = {
	on: on,
	handleEvent: handleEvent
}

function on(typ, fcn) {
	var el = this.el,
			handlers = this.eventHandlers,
			options = {capture: true, passive:true}

	if (typeof typ === 'object') {
		for (var k in typ) this.on(k, typ[k])
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
	var fcn = this.eventHandlers[evt.type]
	evt.stopPropagation()
	fcn.call(this, evt)
}
