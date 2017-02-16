var merge = require('./merge-object')

module.exports = Config

function Config() {
	for (var i=0; i<arguments.length; ++i) if (arguments[i] !== undefined) merge(this, arguments[i])
}
Config.prototype = {
	constructor: Config,
	tag: 'div',
	xmlns: '',
	attrs: null,
	props: null,
	style: null,
	key: '',
	dataKey: null,
	ondata: null,
	oninit: null,
	on: null
}
