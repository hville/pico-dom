import ENV from './env'

/**
* @function text
* @param  {string} string textNode data
* @return {!Object} textNode
*/
export function text(string) {
	return ENV.document.createTextNode(string)
}

/**
* @function fragment
* @return {!Object} documentFragment
*/
export function fragment() {
	return ENV.document.createDocumentFragment()
}

/**
* @function comment
* @param  {string} string commentNode data
* @return {!Object} commentNode
*/
export function comment(string) {
	return ENV.document.createComment(string)
}
