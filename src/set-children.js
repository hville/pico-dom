var insertBefore = require('./el/insert-before'),
		removeAfter = require('./el/remove-after')

module.exports = function setChildren(parent, content) {
	// if single child and that child is Node.TEXT_NODE just transfer the text
	if (content.length === 1 && content[0].nodeType === 3) parent.textContent = content[0].data
	else removeAfter(parent, insertBefore(parent, content, parent.firstChild))
	return parent
}
