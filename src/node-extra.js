import {PunyMap} from './constructors/puny-map'

var nodeExtra = typeof WeakMap !== 'undefined' ? new WeakMap : new PunyMap

export function getNode(item) {
	return item ? item.node || item : void 0
}
/**
* @function getExtra
* @param  {!Object} item node or extra
* @param  {Function} [Extra] creates an instance if not existign
* @return {Object} the extra node context
*/
export function getExtra(item, Extra) {
	if (!item) return void 0
	var extra = item.node ? item : nodeExtra.get(item)
	if (!extra && Extra) nodeExtra.set(item, new Extra(item))
	return extra
}
export function setExtra(node, extra) {
	nodeExtra.set(node, extra)
	return node
}
