import {reduce} from './util/reduce'

export var decorators = {
	attrs: function(elm, val) {
		return val ? reduce(val, setAttr, elm) : elm
	},
	props: function(elm, val) {
		return val ? reduce(val, setProp, elm) : elm
	},
	children: function(elm, arr) {
		return arr ? arr.reduce(setChild, elm) : elm
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
function setChild(elm, child) {
	if (child.moveTo) child.moveTo(elm)
	else elm.appendChild(child)
	return elm
}
