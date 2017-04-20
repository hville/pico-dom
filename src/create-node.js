import {defaultView} from './default-view'
import {creator} from './util/creator'
import {decorate} from './decorate'
import {namespaces} from './namespaces'

var presetElement = creator(decorate)

export var createElement = presetElement()
createElement.svg = presetElement({xmlns: namespaces.svg})
createElement.preset = presetElement

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
