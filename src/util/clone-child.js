import EXTRA from '../extra'

export default function cloneChildren(targetParent, sourceChild, input) {
	if (sourceChild === null) return targetParent
	var	sourceItem = EXTRA.get(sourceChild),
			sourceNext = sourceChild.nextSibling
	if (!sourceItem) {
		targetParent.appendChild(cloneChildren(sourceChild.cloneNode(false), sourceChild.firstChild, input))
	}
	else {
		sourceItem.clone(input).moveto(targetParent)
		if (sourceItem.factory) sourceNext = sourceItem.footer.nextSibling
	}
	return cloneChildren(targetParent, sourceNext, input)
}
