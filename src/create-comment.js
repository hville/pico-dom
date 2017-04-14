import {defaultView} from './default-view'

/**
* @function comment
* @param  {string} string commentNode data
* @return {!Object} commentNode
*/
export function createComment(string) {
	return defaultView.document.createComment(string)
}
