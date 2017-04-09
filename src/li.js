import Component from './component'
import List from './list'

function createFactory(instance) {
	return function(k, i) {
		var comp = instance.clone(k, i)
		return comp
	}
}

export default function list(model, dataKey) {
	switch (model.constructor) {
		case Function:
			return new List(model, dataKey)
		case Component: case List:
			return new List(createFactory(model), dataKey)
		default:
			throw Error('invalid list model:' + typeof model)
	}
}
