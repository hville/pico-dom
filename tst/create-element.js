var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		ce = require('../src/el/create-element'),
		globals = require('../src/util/root')

globals.document = jsdom()

ct('ce-api', function() {
	ct('===', ce(null, 'div').tagName, 'DIV')
	ct('===', ce(null, '#a').tagName, 'DIV')
})
