var typ = require('./typ'),
		text = require('../text')

module.exports = getChildItems

function getChildItems(children) {
	if (Array.isArray(children)) return children.reduce(addItem, [])
	return addItem([], children)
}
function addItem(arr, itm) {
	var cnt = getItem(itm)
	if (cnt) arr.push(cnt)
	return arr
}
function getItem(itm) {
	switch (typ(itm)) {
		case Function: return getItem(itm())
		case Number: return text(''+itm)
		case String: return itm === '' ? null : text(itm)
		default: return itm
	}
}
