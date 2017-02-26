var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		tx = require('../src/text'),
		ENV = require('../src/util/root'),
		el = require('../src/el')

ENV.window = jsdom().defaultView

ct('text-text()', function() {
	var elm = tx('div')
	ct('===', elm instanceof ENV.Node, true)
	ct('===', typeof elm, 'object')
	ct('===', elm.nodeName.toLowerCase(), '#text')
})
ct('text-el()', function() {
	var elm = el('#', 'div')
	ct('===', elm instanceof ENV.Node, true)
	ct('===', typeof elm, 'object')
	ct('===', elm.nodeName.toLowerCase(), '#text')
})
