export function setChildren(parent, children, after, before) {
	var cursor = after || null

	// insert new children or re-insert existing
	if (children) for (var i=0; i<children.length; ++i) {
		cursor = placeChild(parent, children[i], cursor)
	}

	// remove orphans
	cursor = cursor ? cursor.nextSibling : parent.firstChild
	while (cursor != before) { //eslint-disable-line eqeqeq
		var next = cursor.nextSibling
		parent.removeChild(cursor)
		cursor = next
	}
	return parent
}

export function placeChild(parent, child, after) {
	if (!after) return parent.insertBefore(child, parent.firstChild)
	var before = after.nextSibling
	return !before ? parent.appendChild(child)
	: child === before ? child
	// likely deletion, possible reshuffle
	: child === before.nextSibling ? parent.removeChild(before)
	// insert child before oldChild
	: parent.insertBefore(child, before)
}
