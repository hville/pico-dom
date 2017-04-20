import {Component} from './constructors/component'
import {List} from './constructors/list'
import {cloneNode} from './clone-node'

/**
* @function list
* @param  {List|Component|Function} model list or component factory or instance to be cloned
* @param  {Function|string|number} [dataKey] record identifier
* @return {!List} new List
*/
/**
* @function list
* @param  {List|Node|Function} model list or component factory or instance to be cloned
* @param  {Function|string|number} [dataKey] record identifier
* @return {!List} new List
*/
export function createList(model, dataKey) {
	switch (model.constructor) {
		case Function:
			return new List(model, dataKey)
		case List:
			return new List(function() { return model.clone() }, dataKey )
		case Component:
			return new List(function() { return cloneNode(model.node, true) }, dataKey )
		default:
			if (model.cloneNode) return new List(function() { return model.cloneNode(true) }, dataKey ) //TODO use cloneNode(node) to get components in tree
			throw Error('invalid list model:' + typeof model)
	}
}
