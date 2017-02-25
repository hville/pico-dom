var Extra = require('../extra/extra'),
		List = require('../extra/list'),
		store = require('../extra/store')

module.exports = cloneTree

function cloneTree(model) {
	var clone, modelC
	// clone the model as it is: Element, Component or List
	if (model.nodeType) {
		clone = model.cloneNode(false)
		modelC = model.firstChild
	}
	else if (model.factory) {
		clone = new List(model.factory, model.dataKey)
		modelC = null
		store(clone.footer, clone)
		store(clone.header, clone)
	}
	else {
		clone = new Extra(model.cloneNode(false), { oninit: model.oninit, ondata: model.ondata, onmove: model.onmove, on: model.on() }) //TODO on...
		modelC = model.node.firstChild
		store(clone.node, clone)
	}

	// recursively clone children
	while(modelC) {
		modelC = store(modelC) || modelC
		var cloneC = cloneTree(modelC)
		if (cloneC.nodeType) {
			clone.appendChild(cloneC)
			modelC = modelC.nextSibling
		}
		else if (cloneC.factory) {
			cloneC.moveto(clone)
			modelC = modelC.footer.nextSibling
		}
		else {
			cloneC.moveto(clone)
			modelC = modelC.node.nextSibling
		}
	}
	return clone
}
