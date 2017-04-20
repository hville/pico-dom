/**
* @function setText
* @param  {!Object} node node
* @param  {string} text textNode data
* @return {!Object} node
*/
export function setText(node, text) {
	var child = node.firstChild
	if (child && !child.nextSibling && child.nodeValue !== text) child.nodeValue = text
	else node.textContent = text
	return node
}
