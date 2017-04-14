import {defaultView} from './default-view'

/**
* @function fragment
* @return {!Object} documentFragment
*/
export function createDocumentFragment() {
	return defaultView.document.createDocumentFragment()
}
