module.exports = function removeAfter(parent, after) {
	if (!after) return null
	var next = parent.lastChild,
			last = after.el || (after.content && after.lastKin) || after
	while (next !== last) {
		next = parent.removeChild(next).previousSibling
	}
	return after
}
