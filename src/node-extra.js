import {PunyMap} from './constructors/puny-map'

var nodeExtra = typeof WeakMap !== 'undefined' ? new WeakMap : new PunyMap

export function getNode(item) {
	return item ? item.node || item : void 0
}
/**
* @function getExtras
* @param  {!Object} item node or extra
* @param  {Function} [Extra] creates an instance if not existign
* @return {Object} the extra node context
*/
export function getExtras(item, Extra) {
	if (!item) return void 0
	var extra = item.node ? item : nodeExtra.get(item)
	if (!extra && Extra) {
		extra = new Extra(item)
		nodeExtra.set(item, extra)
	}
	return extra
}
export function setExtras(node, extra) {
	nodeExtra.set(node, extra)
	return node
}
