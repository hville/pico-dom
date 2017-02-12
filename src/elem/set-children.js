var typ = require('../util/typ'),
		child = require('./get-child')

module.exports = function setChildren(e, c) {
	if (c.length === 1) switch (typ(c[0])) {
		case typ.N: case typ.S: return e.textContent = c[0]
	}
	var ptr = e.firstChild
	for (var i=0; i<c.length; ++i) {
		var node = child(c[i])
		if (node && node !== ptr) e.appendChild(node, ptr)
	}
	while (ptr) {
		var next = ptr.nextSibling
		e.removeChild(ptr)
		ptr = next
	}
}
