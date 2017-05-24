/**
 * @function
 * @param {string|number} key
 * @param {*} val value
 * @returns {!Object} this
 */
export function setThis(key, val) {
	this[key] = val
	return this
}
