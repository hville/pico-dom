var globals = require('../root/root'),
		typ = require('../util/typ')

module.exports = function createChild(itm) {
	switch (typ(itm)) {
		case globals.Node:
			return itm.cloneNode(true)
		case Function:
			return itm()
		case Number: case String:
			if (itm !== '') return globals.document.createTextNode(itm)
	}
}
