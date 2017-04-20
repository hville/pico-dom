var jsdom = require('jsdom').jsdom,
		ct = require('cotest'),
		P = require('../dist/index.js')

P.setDefaultView(jsdom().defaultView)

var el = P.createElement

ct('el - dynamic', function() {
	var updateValue = function(v) {this.value = v}
	var el0 = el('input', {
		extra: {
			update: updateValue
		}
	})
	ct('===', P.getExtra(el0).update, updateValue)

	var el1 = P.cloneNode(el0, true)
	P.updateNode(el0, 'abc')
	ct('===', el0.value, 'abc')
	ct('===', el1.value, '')
	P.updateNode(el1, 'def')
	ct('===', el0.value, 'abc')
	ct('===', el1.value, 'def')
})
