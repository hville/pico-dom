import {List} from './constructors/list'
import {cloneNode} from './clone-node'

/**
* @function list
* @param  {List|Function} model list or component factory or instance to be cloned
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
		default:
			return new List(function() { return cloneNode(model, true) }, dataKey )
	}
}
