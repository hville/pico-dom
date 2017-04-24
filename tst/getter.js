var ct = require('cotest'),
		X = require('../dist/index.js')

var getter = X.getter

ct('getter', function() {
	var a = getter(),
			b = a.map(0),
			c = b.map(1,2),
			v = ['a' , 'b', 'c']
	ct('{==}', a.path, [])
	ct('{==}', b.path, [0])
	ct('{==}', c.path, [0,1,2])
	ct('===', a.get(v), v)
	ct('===', b.get(v), 'a')
	ct('===', c.get(v), undefined)
})
