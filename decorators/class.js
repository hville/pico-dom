var ns = require('../namespaces')
/*
	Optional helper that can be added to the element decorators
*/
module.exports = function(elm, txt) {
	var isNS = !elm.namespaceURI || elm.namespaceURI === ns.html
	return isNS ? this.attrs(elm, {key: txt}) : this.props(elm, {className: txt})
}
