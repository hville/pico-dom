import {defaultView} from './default-view'

/**
* @function text
* @param  {string} string textNode data
* @return {!Object} textNode
*/
export function createTextNode(string) {
	return defaultView.document.createTextNode(string)
}
