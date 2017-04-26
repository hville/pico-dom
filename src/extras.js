// ᵖᵢᶜₒ
export var extras = {
	get: function(node) { return node._pico },
	set: function(node, val) { return node._pico = val },
	node: function(obj) { return obj.node || obj.nodeType && obj || null }
}
