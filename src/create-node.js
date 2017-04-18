import {defaultView} from './default-view'

/**
* @function comment
* @param  {string} string commentNode data
* @return {!Object} commentNode
*/
export function createComment(string) {
	return defaultView.document.createComment(string)
}

/**
* @function text
* @param  {string} string textNode data
* @return {!Object} textNode
*/
export function createTextNode(string) {
	return defaultView.document.createTextNode(string)
}

/**
* @function fragment
* @return {!Object} documentFragment
*/
export function createDocumentFragment() {
	return defaultView.document.createDocumentFragment()
}
