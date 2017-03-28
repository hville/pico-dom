var mapEC = require('../env').extra

module.exports = function cloneChildren(targetParent, sourceChild) {
	if (sourceChild === null) return targetParent
	var	sourceItem = mapEC.get(sourceChild),
			sourceNext = sourceChild.nextSibling
	if (!sourceItem) {
		targetParent.appendChild(cloneChildren(sourceChild.cloneNode(false), sourceChild.firstChild))
	}
	else {
		sourceItem.clone().moveto(targetParent)
		if (sourceItem.factory) sourceNext = sourceItem.footer.nextSibling
	}
	return cloneChildren(targetParent, sourceNext)
}
