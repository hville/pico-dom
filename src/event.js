var ctyp = require('./util/typ')

module.exports = {
	listen: listen,
	handleEvent: handleEvent
}

function listen(typ, fcn) {
	var el = this.el,
			handlers = this.on,
			options = {capture: true, passive:true}

	if (ctyp(typ) === Object) {
		for (var k in typ) this.listen(k, typ[k])
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
