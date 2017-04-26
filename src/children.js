import {extras} from './extras'

export function updateChildren(parent, v,k,o, after, before) {
	var cursor = after ? after.nextSibling : parent.firstChild
	while (cursor != before) { //eslint-disable-line eqeqeq
		var extra = extras.get(cursor)
		if (extra) {
			extra.update(v,k,o)
			if (extra.foot) cursor = extra.foot
		}
		cursor = cursor.nextSibling
	}
	return parent
}

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
	var target = extras.node(parent)
	if (!after) return target.insertBefore(child, parent.firstChild) //TODO getNode
	var before = after.nextSibling
	return !before ? parent.appendChild(child)
	: child === before ? child
	// likely deletion, possible reshuffle
	: child === before.nextSibling ? parent.removeChild(before)
	// insert child before oldChild
	: target.insertBefore(child, before) //TODO getNode
}
