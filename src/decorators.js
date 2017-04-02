var reduce = require('./util/reduce')

module.exports = {
	attrs: function(elm, val) {
		return val ? reduce(val, setAttr, elm) : elm
	},
	props: function(elm, val) {
		return val ? reduce(val, setProp, elm) : elm
	}
}
function setAttr(elm, val, key) {
	if (val === false) elm.removeAttribute(key)
	else elm.setAttribute(key, val === true ? '' : val)
	return elm
}
function setProp(elm, val, key) {
	if (elm[key] !== val) elm[key] = val
	return elm
}
