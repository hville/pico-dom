module.exports = function insertBefore(parent, content, before) {
	if (!content.length) return null
	//TODO arrayOnly???
	for (var i=0; i<content.length; ++i) if (content[i]) {
		var child = content[i].el || content[i]
		if (child === before) before = child.nextSibling
		else if (child.moveTo) child.moveTo(parent, before)
		else parent.insertBefore(child, before)
	}
	return content[content.length-1]
}
