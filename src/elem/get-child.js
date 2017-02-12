var dom = require('../root/root'),
		typ = require('../util/typ')

module.exports = function getChild(itm) {
	switch (typ(itm)) {
		case typ.E:
			return itm.cloneNode(true)
		case typ.F:
			return itm()
		case typ.N:
			return dom.document.createTextNode(itm)
		case typ.S: //skip empty string
			if (itm) return dom.document.createTextNode(itm)
	}
}
