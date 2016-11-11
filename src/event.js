module.exports = {
	on: on,
	handleEvent: handleEvent
}

function on(typ, fcn) {
	if (typeof typ === 'object') {
		for (var k in typ) this.on(k, typ[k])
	}
	else if (!fcn) {
		delete this.eventHandlers[typ]
		this.el.removeEventListener(typ, this, {capture: true, passive:true})
	}
	else {
		this.eventHandlers[typ] = fcn
		this.el.addEventListener(typ, this, {capture: true, passive:true})
	}
	return this
}
// standard property called by window on event, binded to co
function handleEvent(evt) {
	var fcn = this.eventHandlers[evt.type]
	evt.stopPropagation()
	fcn.call(this, evt)
}
