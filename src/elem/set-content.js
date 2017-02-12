var typ = require('../util/typ'),
		createChild = require('./create-child')
// TODO do we clone content of not???
// element: No-used once only, then cloned if re-used
// component: No-used once onlu, then cloned if re-used
// list:
module.exports = function setContent(elm, cnt) {
	if (cnt.length === 1) switch (typ(cnt[0])) {
		case Number: case String:
			elm.textContent = cnt[0]
			return elm
	}
	var ptr = elm.firstChild
	for (var i=0; i<cnt.length; ++i) {
		var child = createChild(cnt[i])
		if (child) {
			if (child === ptr) ptr = child.nextSibling()
			else elm.insertBefore(child, ptr)
		}
	}
	while (ptr) {
		var next = ptr.nextSibling
		elm.removeChild(ptr)
		ptr = next
	}
	return elm
}
