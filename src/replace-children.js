export function replaceChildren(parent, childIterator, after, before) {
	var ctx = {
		parent: parent,
		cursor: after ? after.nextSibling : parent.firstChild,
		before: before || null
	}

	// insert new children or re-insert existing
	if (childIterator) {
		childIterator.forEach(insertNewChild, ctx)
	}

	// remove orphans
	var cursor = ctx.cursor
	while (cursor != before) { //eslint-disable-line eqeqeq
		var next = cursor.nextSibling
		parent.removeChild(cursor)
		cursor = next
	}
	return parent
}
function insertNewChild(newChild) {
	var parent = this.parent,
			cursor = this.cursor,
			before = this.before
	// no existing children, just append
	if (cursor === null) parent.appendChild(newChild)
	// right position, move on
	else if (newChild === cursor) this.cursor = cursor.nextSibling
	// likely deletion, possible reshuffle. move oldChild to end
	else if (newChild === cursor.nextSibling) {
		parent.insertBefore(cursor, before)
		this.cursor = newChild.nextSibling
	}
	// insert newChild before oldChild
	else parent.insertBefore(newChild, cursor)
}
