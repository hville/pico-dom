import {getExtra} from '../node-extra'

export function cloneChildren(targetParent, sourceChild) {
	if (sourceChild === null) return targetParent
	var	sourceItem = getExtra(sourceChild),
			sourceNext = sourceChild.nextSibling
	if (!sourceItem) {
		targetParent.appendChild(cloneChildren(sourceChild.cloneNode(false), sourceChild.firstChild))
	}
	else {
		sourceItem.clone().moveTo(targetParent)
		if (sourceItem.factory) sourceNext = sourceItem.footer.nextSibling
	}
	return cloneChildren(targetParent, sourceNext)
}
