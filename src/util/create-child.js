var G = require('./root'),
		typ = require('./typ'),
		text = require('../text')

module.exports = function createChild(itm) {
	switch (typ(itm)) {
		case G.Node: case Object: return itm
		case Function: return itm()
		case Number:
		case String: if (itm !== '') return text(itm)
	}
}
