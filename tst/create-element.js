var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		ce = require('../src/el/create-element'),
		globals = require('../src/util/root')

globals.document = jsdom()

ct('ce-api', function() {
	ct('===', ce('div').tagName, 'DIV')
	ct('===', ce('#a').tagName, 'DIV')
})
