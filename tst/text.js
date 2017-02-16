var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		tx = require('../src/text'),
		globals = require('../src/util/root')

globals.document = jsdom()

ct('text', function() {
	var elm = tx('div')
	ct('===', elm instanceof globals.Node, true)
	ct('===', typeof elm, 'object')
	ct('===', elm.nodeName.toLowerCase(), '#text')
})
