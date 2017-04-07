export default typeof WeakMap !== 'undefined' ? new WeakMap() : {
	set: function(node, comp) { node._$comp_ = comp },
	get: function(node) { return node._$comp_ }
}

